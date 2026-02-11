import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/admin-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authorization - get email from header or query param
    const email = request.headers.get('x-admin-email') || request.nextUrl.searchParams.get('email')
    
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

    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(payment)
  } catch (error: any) {
    console.error('Failed to fetch payment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch payment' },
      { status: 500 }
    )
  }
}
