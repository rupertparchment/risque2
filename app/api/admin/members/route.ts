import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const members = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        dateOfBirth: true,
        membershipStatus: true,
        membershipStart: true,
        membershipEnd: true,
        stripeCustomerId: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            payments: true,
            rsvps: true,
          },
        },
      },
    })

    return NextResponse.json(members)
  } catch (error: any) {
    console.error('Failed to fetch members:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch members' },
      { status: 500 }
    )
  }
}
