import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeDeleted = searchParams.get('includeDeleted') === 'true'
    const sortBy = searchParams.get('sortBy') || 'createdAt' // firstName, lastName, createdAt
    const sortOrder = searchParams.get('sortOrder') || 'desc' // asc, desc

    // Build orderBy clause
    let orderBy: any = {}
    if (sortBy === 'firstName') {
      orderBy = { firstName: sortOrder }
    } else if (sortBy === 'lastName') {
      orderBy = { lastName: sortOrder }
    } else {
      orderBy = { createdAt: sortOrder }
    }

    const members = await prisma.user.findMany({
      where: includeDeleted
        ? {} // Show all members including deleted
        : {
            isDeleted: false, // Only show non-deleted members
          },
      orderBy,
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
        _count: {
          select: {
            payments: true,
            rsvps: true,
          },
        },
      },
    })

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
    const formattedMembers = members.map(member => ({
      ...member,
      dateOfBirth: formatDateForResponse(member.dateOfBirth),
      membershipStart: formatDateForResponse(member.membershipStart),
      membershipEnd: formatDateForResponse(member.membershipEnd),
    }))

    return NextResponse.json(formattedMembers)
  } catch (error: any) {
    console.error('Failed to fetch members:', error)
    
    // Check if error is related to missing columns
    if (error.message && error.message.includes('addressLine1') || error.message.includes('Unknown column')) {
      return NextResponse.json(
        { 
          error: 'Database migration required. Please run the SQL script ADD_ADDRESS_FIELDS_TO_USER.sql in your Supabase SQL Editor to add address columns.',
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch members' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      password,
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
    } = body

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Helper function to parse date strings and store as UTC midnight
    const parseLocalDate = (dateString: string): Date => {
      if (!dateString || dateString.trim() === '') {
        throw new Error('Empty date string')
      }
      // Parse YYYY-MM-DD format
      const [year, month, day] = dateString.split('-').map(Number)
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error('Invalid date format')
      }
      // Create date at UTC midnight to avoid timezone shifts when storing
      // This ensures the date stored in the database is exactly the date the user entered
      return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
    }

    // Clean phone number - remove formatting, keep only digits
    const cleanPhone = phone ? phone.replace(/\D/g, '') : null
    // Only store if it's 10 digits
    const phoneToStore = cleanPhone && cleanPhone.length === 10 ? cleanPhone : null

    // Create member
    const member = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phoneToStore,
        dateOfBirth: dateOfBirth && dateOfBirth.trim() ? parseLocalDate(dateOfBirth) : null,
        addressLine1: addressLine1 || null,
        addressLine2: addressLine2 || null,
        city: city || null,
        state: state || null,
        zip: zip || null,
        membershipStatus: membershipStatus || 'pending',
        membershipStart: membershipStart && membershipStart.trim() ? parseLocalDate(membershipStart) : null,
        membershipEnd: membershipEnd && membershipEnd.trim() ? parseLocalDate(membershipEnd) : null,
      },
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
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            payments: true,
            rsvps: true,
          },
        },
      },
    })

    // Helper to format date for JSON response
    const formatDateForResponse = (date: Date | null): string | null => {
      if (!date) return null
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const day = String(date.getUTCDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const response = {
      ...member,
      dateOfBirth: formatDateForResponse(member.dateOfBirth),
      membershipStart: formatDateForResponse(member.membershipStart),
      membershipEnd: formatDateForResponse(member.membershipEnd),
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Failed to create member:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create member' },
      { status: 500 }
    )
  }
}
