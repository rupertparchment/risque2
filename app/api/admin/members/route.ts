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

    return NextResponse.json(members)
  } catch (error: any) {
    console.error('Failed to fetch members:', error)
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

    // Helper function to parse date strings as local dates (not UTC)
    const parseLocalDate = (dateString: string): Date => {
      if (!dateString || dateString.trim() === '') {
        throw new Error('Empty date string')
      }
      // Parse YYYY-MM-DD format as local date (not UTC)
      const [year, month, day] = dateString.split('-').map(Number)
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error('Invalid date format')
      }
      // Create date at local midnight to avoid timezone shifts
      return new Date(year, month - 1, day, 0, 0, 0, 0) // month is 0-indexed in JS Date
    }

    // Create member
    const member = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        dateOfBirth: dateOfBirth && dateOfBirth.trim() ? parseLocalDate(dateOfBirth) : null,
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

    return NextResponse.json(member)
  } catch (error: any) {
    console.error('Failed to create member:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create member' },
      { status: 500 }
    )
  }
}
