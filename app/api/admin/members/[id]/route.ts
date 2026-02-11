import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const member = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        dateOfBirth: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        zip: true,
        membershipStatus: true,
        membershipStart: true,
        membershipEnd: true,
        stripeCustomerId: true,
        isDeleted: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // Helper to format date for JSON response (simple date extraction)
    const formatDateForResponse = (date: Date | null): string | null => {
      if (!date) return null
      // Extract date components - dates are stored at UTC midnight, so use UTC methods
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const day = String(date.getUTCDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    // Format dates as YYYY-MM-DD strings to avoid timezone issues
    const response = {
      ...member,
      dateOfBirth: formatDateForResponse(member.dateOfBirth),
      membershipStart: formatDateForResponse(member.membershipStart),
      membershipEnd: formatDateForResponse(member.membershipEnd),
      deletedAt: member.deletedAt ? member.deletedAt.toISOString() : null,
      createdAt: member.createdAt.toISOString(),
      updatedAt: member.updatedAt.toISOString(),
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Failed to fetch member:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch member' },
      { status: 500 }
    )
  }
}

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
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
      membershipStatus,
      membershipStart,
      membershipEnd,
      password,
    } = body

    // Helper function to parse YYYY-MM-DD date strings and store as UTC midnight
    const parseLocalDate = (dateString: string): Date => {
      if (!dateString || dateString.trim() === '') {
        throw new Error('Empty date string')
      }
      // Parse YYYY-MM-DD format
      const [year, month, day] = dateString.split('-').map(Number)
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error('Invalid date format')
      }
      // Store at UTC midnight - simple and consistent
      return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
    }

    // Clean phone number - remove formatting, keep only digits
    const cleanPhone = phone ? phone.replace(/\D/g, '') : null
    // Only store if it's 10 digits
    const phoneToStore = cleanPhone && cleanPhone.length === 10 ? cleanPhone : null

    const updateData: any = {
      email,
      firstName,
      lastName,
      phone: phoneToStore,
      dateOfBirth: dateOfBirth && dateOfBirth.trim() ? parseLocalDate(dateOfBirth) : null,
      membershipStatus,
      membershipStart: membershipStart && membershipStart.trim() ? parseLocalDate(membershipStart) : null,
      membershipEnd: membershipEnd && membershipEnd.trim() ? parseLocalDate(membershipEnd) : null,
    }

    // Only add address fields if they're provided (handle case where columns might not exist)
    if (addressLine1 !== undefined) updateData.addressLine1 = addressLine1 || null
    if (addressLine2 !== undefined) updateData.addressLine2 = addressLine2 || null
    if (city !== undefined) updateData.city = city || null
    if (state !== undefined) updateData.state = state || null
    if (zip !== undefined) updateData.zip = zip || null

    // Only update password if provided
    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    let member
    try {
      member = await prisma.user.update({
        where: { id: params.id },
        data: updateData,
      })
    } catch (dbError: any) {
      // If address columns don't exist, try updating without them
      if (dbError.message && (dbError.message.includes('addressLine1') || dbError.message.includes('Unknown column') || dbError.message.includes('column') && dbError.message.includes('does not exist'))) {
        console.log('Address columns not found, updating without them...')
        const updateDataWithoutAddress = { ...updateData }
        delete updateDataWithoutAddress.addressLine1
        delete updateDataWithoutAddress.addressLine2
        delete updateDataWithoutAddress.city
        delete updateDataWithoutAddress.state
        delete updateDataWithoutAddress.zip
        
        member = await prisma.user.update({
          where: { id: params.id },
          data: updateDataWithoutAddress,
        })
      } else {
        throw dbError
      }
    }

    // Helper to format date for JSON response (simple date extraction)
    const formatDateForResponse = (date: Date | null): string | null => {
      if (!date) return null
      // Extract date components - dates are stored at UTC midnight, so use UTC methods
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const day = String(date.getUTCDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    // Don't return the password hash
    const { password: _, ...memberWithoutPassword } = member

    // Format dates as YYYY-MM-DD strings to avoid timezone issues
    const response = {
      ...memberWithoutPassword,
      dateOfBirth: formatDateForResponse(member.dateOfBirth),
      membershipStart: formatDateForResponse(member.membershipStart),
      membershipEnd: formatDateForResponse(member.membershipEnd),
    }

    return NextResponse.json(response)
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
