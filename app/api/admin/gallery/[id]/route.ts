import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, imageUrl, category, displayOrder, isActive } = body

    const image = await prisma.galleryImage.update({
      where: { id: params.id },
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
    console.error('Failed to update gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to update gallery image' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.galleryImage.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to delete gallery image' },
      { status: 500 }
    )
  }
}
