import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, role, password, isActive } = body

    const validRoles = ['administrator', 'editor', 'viewer']
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Role must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      )
    }

    const updateData: any = {
      firstName,
      lastName,
      role,
      isActive: isActive !== undefined ? isActive : true,
    }

    // Only update password if provided
    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const user = await prisma.adminUser.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        isDeleted: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Failed to update admin user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update admin user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Soft delete
    await prisma.adminUser.update({
      where: { id: params.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, message: 'User disabled successfully' })
  } catch (error: any) {
    console.error('Failed to delete admin user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete admin user' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'restore') {
      await prisma.adminUser.update({
        where: { id: params.id },
        data: {
          isDeleted: false,
          deletedAt: null,
        },
      })
      return NextResponse.json({ success: true, message: 'User restored successfully' })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Failed to restore admin user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to restore admin user' },
      { status: 500 }
    )
  }
}
