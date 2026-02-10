import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { eventDate: 'desc' },
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
      eventTime,
      eventType,
      theme,
      flyerImage,
      interiorImage,
      capacity,
      price,
      isActive,
    } = body

    const event = await prisma.event.create({
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        eventTime,
        eventType,
        theme: theme || null,
        flyerImage: flyerImage || null,
        interiorImage: interiorImage || null,
        capacity: parseInt(capacity),
        price: parseFloat(price),
        isActive: isActive !== undefined ? isActive : true,
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Failed to create event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
