import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }
    if (type && type !== 'all') {
      where.paymentType = type
    }

    const payments = await prisma.payment.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(payments)
  } catch (error: any) {
    console.error('Failed to fetch payments:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}
