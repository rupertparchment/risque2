import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      email,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      membershipStatus,
      membershipStart,
      membershipEnd,
      password,
    } = body

    // Helper function to parse date strings as local dates (not UTC)
    const parseLocalDate = (dateString: string): Date => {
      // Parse YYYY-MM-DD format as local date (not UTC)
      const [year, month, day] = dateString.split('-').map(Number)
      return new Date(year, month - 1, day) // month is 0-indexed in JS Date
    }

    const updateData: any = {
      email,
      firstName,
      lastName,
      phone: phone || null,
      dateOfBirth: dateOfBirth ? parseLocalDate(dateOfBirth) : null,
      membershipStatus,
      membershipStart: membershipStart ? parseLocalDate(membershipStart) : null,
      membershipEnd: membershipEnd ? parseLocalDate(membershipEnd) : null,
    }

    // Only update password if provided
    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const member = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
    })

    // Don't return the password hash
    const { password: _, ...memberWithoutPassword } = member

    return NextResponse.json(memberWithoutPassword)
  } catch (error: any) {
    console.error('Failed to update member:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update member' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Soft delete: mark as deleted instead of removing from database
    await prisma.user.update({
      where: { id: params.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, message: 'Member disabled successfully' })
  } catch (error: any) {
    console.error('Failed to delete member:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete member' },
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
      // Restore a deleted member
      await prisma.user.update({
        where: { id: params.id },
        data: {
          isDeleted: false,
          deletedAt: null,
        },
      })
      return NextResponse.json({ success: true, message: 'Member restored successfully' })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Failed to restore member:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to restore member' },
      { status: 500 }
    )
  }
}
