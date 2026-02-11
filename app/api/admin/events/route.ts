import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { eventDate: 'asc' },
    })
    return NextResponse.json(events)
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      eventDate,
      eventType,
      theme,
      flyerImage,
      interiorImage,
      priceCouple,
      priceMale,
      priceFemale,
      totalCouples,
      totalMales,
      totalFemales,
      isActive,
    } = body

    // Convert price values - handle both string and number inputs
    const parsePrice = (value: any): number | null => {
      if (value === null || value === undefined || value === '') return null
      const num = typeof value === 'string' ? parseFloat(value) : value
      return isNaN(num) ? null : num
    }

    // Convert attendance values - handle both string and number inputs
    const parseAttendance = (value: any): number => {
      if (value === null || value === undefined || value === '') return 0
      const num = typeof value === 'string' ? parseInt(value, 10) : value
      return isNaN(num) ? 0 : num
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        eventTime: null,
        eventType,
        theme: theme || null,
        flyerImage: flyerImage || null,
        interiorImage: interiorImage || null,
        capacity: null,
        priceCouple: parsePrice(priceCouple),
        priceMale: parsePrice(priceMale),
        priceFemale: parsePrice(priceFemale),
        totalCouples: parseAttendance(totalCouples),
        totalMales: parseAttendance(totalMales),
        totalFemales: parseAttendance(totalFemales),
        isActive: isActive !== undefined ? isActive : true,
      },
    })

    return NextResponse.json(event)
  } catch (error: any) {
    console.error('Failed to create event:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create event' },
      { status: 500 }
    )
  }
}
