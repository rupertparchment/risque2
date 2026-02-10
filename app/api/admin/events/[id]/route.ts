import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const event = await prisma.event.update({
      where: { id: params.id },
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
    console.error('Failed to update event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.event.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
