import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const referralSources = await prisma.referralSource.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
      select: {
        id: true,
        name: true,
        displayOrder: true,
      },
    })

    return NextResponse.json(referralSources)
  } catch (error: any) {
    console.error('Failed to fetch referral sources:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch referral sources' },
      { status: 500 }
    )
  }
}
