import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
        receiveEmails: true,
        digitalSignature: true,
        referralSourceId: true,
        referralSource: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Format dates
    const formatDateForResponse = (date: Date | null): string | null => {
      if (!date) return null
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const day = String(date.getUTCDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    return NextResponse.json({
      ...user,
      dateOfBirth: formatDateForResponse(user.dateOfBirth),
      membershipStart: formatDateForResponse(user.membershipStart),
      membershipEnd: formatDateForResponse(user.membershipEnd),
    })
  } catch (error: any) {
    console.error('Failed to fetch profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
      receiveEmails,
      digitalSignature,
      referralSourceId,
    } = body

    // Helper function to parse date strings
    const parseLocalDate = (dateString: string): Date => {
      if (!dateString || dateString.trim() === '') {
        throw new Error('Empty date string')
      }
      const [year, month, day] = dateString.split('-').map(Number)
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error('Invalid date format')
      }
      return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
    }

    // Clean phone number
    const cleanPhone = phone ? phone.replace(/\D/g, '') : null
    const phoneToStore = cleanPhone && cleanPhone.length === 10 ? cleanPhone : null

    const updateData: any = {
      firstName,
      lastName,
      phone: phoneToStore,
      dateOfBirth: dateOfBirth && dateOfBirth.trim() ? parseLocalDate(dateOfBirth) : null,
    }

    // Add optional fields if provided
    if (addressLine1 !== undefined) updateData.addressLine1 = addressLine1 || null
    if (addressLine2 !== undefined) updateData.addressLine2 = addressLine2 || null
    if (city !== undefined) updateData.city = city || null
    if (state !== undefined) updateData.state = state || null
    if (zip !== undefined) updateData.zip = zip || null
    if (receiveEmails !== undefined) updateData.receiveEmails = receiveEmails
    if (digitalSignature !== undefined) updateData.digitalSignature = digitalSignature || null
    if (referralSourceId !== undefined) updateData.referralSourceId = referralSourceId || null

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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
        receiveEmails: true,
        digitalSignature: true,
        referralSourceId: true,
        referralSource: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    })

    // Format dates
    const formatDateForResponse = (date: Date | null): string | null => {
      if (!date) return null
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const day = String(date.getUTCDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    return NextResponse.json({
      ...user,
      dateOfBirth: formatDateForResponse(user.dateOfBirth),
      membershipStart: formatDateForResponse(user.membershipStart),
      membershipEnd: formatDateForResponse(user.membershipEnd),
    })
  } catch (error: any) {
    console.error('Failed to update profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}
