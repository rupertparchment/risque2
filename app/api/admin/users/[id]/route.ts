import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { verifyAdminAccess } from '@/lib/admin-auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, role, password, isActive } = body

    // Get the user being updated
    const userBeingUpdated = await prisma.adminUser.findUnique({
      where: { id: params.id },
      select: { email: true, role: true },
    })

    if (!userBeingUpdated) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get requester's role to check permissions
    const requesterEmail = request.headers.get('x-admin-email') || body.requesterEmail
    let requesterRole: string | null = null
    
    if (requesterEmail) {
      try {
        const requester = await prisma.adminUser.findUnique({
          where: { email: requesterEmail },
          select: { role: true, isActive: true, isDeleted: true },
        })
        if (requester && !requester.isDeleted && requester.isActive) {
          requesterRole = requester.role
        }
      } catch (error) {
        console.error('Error checking requester role:', error)
      }
    }

    const validRoles = ['administrator', 'editor', 'viewer']
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Role must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      )
    }

    // Check if role is being changed
    const isRoleChange = role && role !== userBeingUpdated.role
    
    // Only administrators can change roles
    if (isRoleChange && requesterRole !== 'administrator') {
      return NextResponse.json(
        { error: 'Only administrators can change user roles' },
        { status: 403 }
      )
    }

    const updateData: any = {
      firstName,
      lastName,
      isActive: isActive !== undefined ? isActive : true,
    }

    // Only include role if requester is administrator OR if role isn't changing
    if (role) {
      if (requesterRole === 'administrator') {
        // Administrators can change any role
        updateData.role = role
      } else if (!isRoleChange) {
        // Non-administrators can keep the same role (no change)
        updateData.role = role
      }
      // If role is changing and requester is not admin, role won't be included (already blocked above)
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

    if (action === 'permanentDelete') {
      await prisma.adminUser.delete({
        where: { id: params.id },
      })
      return NextResponse.json({ success: true, message: 'User permanently deleted successfully' })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Failed to process admin user action:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process action' },
      { status: 500 }
    )
  }
}
