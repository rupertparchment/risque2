import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Log DATABASE_URL status (first 30 chars only for security)
console.log('DATABASE_URL available:', !!process.env.DATABASE_URL)
console.log('DATABASE_URL starts with postgres:', process.env.DATABASE_URL?.startsWith('postgresql://') || process.env.DATABASE_URL?.startsWith('postgres://'))

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/admin/gallery - Fetching images')
    const images = await prisma.galleryImage.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    })
    console.log('Found images:', images.length)
    return NextResponse.json(images)
  } catch (error: any) {
    console.error('Failed to fetch gallery images:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch gallery images' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('POST /api/admin/gallery - Received:', body)
    
    const { title, description, imageUrl, category, displayOrder, isActive } = body

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Title and Image URL are required' },
        { status: 400 }
      )
    }

    const image = await prisma.galleryImage.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        category: category || 'interior',
        displayOrder: displayOrder !== undefined ? parseInt(String(displayOrder)) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    })

    console.log('Created image:', image)
    return NextResponse.json(image)
  } catch (error: any) {
    console.error('Failed to create gallery image:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create gallery image' },
      { status: 500 }
    )
  }
}
