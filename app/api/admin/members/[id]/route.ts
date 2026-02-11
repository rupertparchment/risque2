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

    const updateData: any = {
      email,
      firstName,
      lastName,
      phone: phone || null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      membershipStatus,
      membershipStart: membershipStart ? new Date(membershipStart) : null,
      membershipEnd: membershipEnd ? new Date(membershipEnd) : null,
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
    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to delete member:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete member' },
      { status: 500 }
    )
  }
}
