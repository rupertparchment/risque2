import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(images)
  } catch (error) {
    console.error('Failed to fetch gallery images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, imageUrl, category, displayOrder, isActive } = body

    const image = await prisma.galleryImage.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        category: category || 'interior',
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    })

    return NextResponse.json(image)
  } catch (error) {
    console.error('Failed to create gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to create gallery image' },
      { status: 500 }
    )
  }
}
