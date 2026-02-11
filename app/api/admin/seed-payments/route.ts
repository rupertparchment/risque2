import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    // Check authorization - allow env var login or AdminUser table
    const body = await request.json().catch(() => ({}))
    const email = request.headers.get('x-admin-email') || body.email
    
    // Check if it's env var login
    const adminEmail = process.env.ADMIN_EMAIL
    const isEnvVarLogin = email === adminEmail
    
    // If not env var login, verify via AdminUser table
    if (!isEnvVarLogin) {
      const adminUser = await verifyAdminAccess(email)
      if (!adminUser) {
        return NextResponse.json(
          { error: 'Unauthorized. Administrator access required.' },
          { status: 403 }
        )
      }
    }
    // Get all active users
    const users = await prisma.user.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
      take: 20, // Get up to 20 users
    })

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'No users found. Please create some members first.' },
        { status: 400 }
      )
    }

    // Get some events for event payments
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
      },
      take: 5,
    })

    const statuses = ['completed', 'pending', 'failed', 'refunded']
    const paymentTypes = ['membership', 'event']
    
    // Generate 10 random payments
    const payments = []
    const now = new Date()
    
    for (let i = 0; i < 10; i++) {
      const user = users[Math.floor(Math.random() * users.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const paymentType = paymentTypes[Math.floor(Math.random() * paymentTypes.length)]
      
      // Random amount between $30 and $500
      const amount = Math.round((Math.random() * 470 + 30) * 100) / 100
      
      // For event payments, randomly assign an event
      const eventId = paymentType === 'event' && events.length > 0
        ? events[Math.floor(Math.random() * events.length)].id
        : null
      
      // Random date within last 90 days
      const daysAgo = Math.floor(Math.random() * 90)
      const createdAt = new Date(now)
      createdAt.setDate(createdAt.getDate() - daysAgo)
      
      // Generate a fake Stripe payment ID (format: pi_xxxxxxxxxxxxx)
      const stripePaymentId = status === 'completed' || status === 'refunded'
        ? `pi_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
        : null

      try {
        const payment = await prisma.payment.create({
          data: {
            userId: user.id,
            amount: amount,
            currency: 'usd',
            status: status,
            stripePaymentId: stripePaymentId,
            paymentType: paymentType,
            eventId: eventId,
            createdAt: createdAt,
            updatedAt: createdAt,
          },
        })
        payments.push(payment)
      } catch (error: any) {
        console.error(`Failed to create payment ${i + 1}:`, error.message)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${payments.length} test payments`,
      created: payments.length,
      payments: payments.map(p => ({
        id: p.id,
        userId: p.userId,
        amount: p.amount,
        status: p.status,
        paymentType: p.paymentType,
      })),
    })
  } catch (error: any) {
    console.error('Failed to seed payments:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to seed payments' },
      { status: 500 }
    )
  }
}
