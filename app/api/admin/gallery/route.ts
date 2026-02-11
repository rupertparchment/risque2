import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Lazy initialization of PrismaClient to ensure env vars are available
function getPrisma() {
  const dbUrl = process.env.DATABASE_URL
  console.log('getPrisma() called - DATABASE_URL available:', !!dbUrl)
  console.log('DATABASE_URL starts with postgres:', dbUrl?.startsWith('postgresql://') || dbUrl?.startsWith('postgres://'))
  console.log('DATABASE_URL first 50 chars:', dbUrl?.substring(0, 50) || 'NOT SET')
  console.log('All env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('POSTGRES')))
  
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  
  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    throw new Error(`DATABASE_URL must start with postgresql:// or postgres://. Got: ${dbUrl.substring(0, 30)}...`)
  }
  
  // Explicitly pass DATABASE_URL to PrismaClient to ensure it uses the correct value
  return new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/admin/gallery - Fetching images')
    const prisma = getPrisma()
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

    const prisma = getPrisma()
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
