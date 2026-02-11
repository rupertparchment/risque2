import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    // Check authorization - get email from header or query param
    const email = request.headers.get('x-admin-email') || request.nextUrl.searchParams.get('email')
    
    if (!email || email.trim() === '') {
      return NextResponse.json(
        { error: 'Unauthorized. Email required.' },
        { status: 403 }
      )
    }
    
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
    const period = searchParams.get('period') || 'all' // all, lastYear, last3Months, lastMonth

    // Calculate date filter based on period
    let dateFilter: Date | null = null
    const now = new Date()
    
    switch (period) {
      case 'lastMonth':
        dateFilter = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        break
      case 'last3Months':
        dateFilter = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
        break
      case 'lastYear':
        dateFilter = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
      case 'all':
      default:
        dateFilter = null
        break
    }

    // Build base where clause for users
    const baseWhere: any = {
      isDeleted: false,
    }

    if (dateFilter) {
      baseWhere.createdAt = {
        gte: dateFilter,
      }
    }

    // Get all active referral sources
    const referralSources = await prisma.referralSource.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        displayOrder: true,
      },
    })

    // Get counts for each referral source
    const stats = await Promise.all(
      referralSources.map(async (source) => {
        const count = await prisma.user.count({
          where: {
            ...baseWhere,
            referralSourceId: source.id,
          },
        })

        return {
          id: source.id,
          name: source.name,
          displayOrder: source.displayOrder,
          count,
        }
      })
    )

    // Also get count for users with no referral source (null)
    const noSourceCount = await prisma.user.count({
      where: {
        ...baseWhere,
        referralSourceId: null,
      },
    })

    // Calculate total
    const total = stats.reduce((sum, stat) => sum + stat.count, 0) + noSourceCount

    return NextResponse.json({
      period,
      stats,
      noSourceCount,
      total,
    })
  } catch (error: any) {
    console.error('Failed to fetch referral stats:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch referral statistics' },
      { status: 500 }
    )
  }
}
