import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Sample members with varying statuses
const sampleMembers = [
  {
    email: 'john.doe@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '555-0101',
    dateOfBirth: new Date('1985-05-15'),
    membershipStatus: 'active',
    membershipStart: new Date('2024-01-01'),
    membershipEnd: new Date('2025-01-01'),
  },
  {
    email: 'jane.smith@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '555-0102',
    dateOfBirth: new Date('1990-08-22'),
    membershipStatus: 'active',
    membershipStart: new Date('2024-02-15'),
    membershipEnd: new Date('2025-02-15'),
  },
  {
    email: 'mike.johnson@example.com',
    password: 'password123',
    firstName: 'Mike',
    lastName: 'Johnson',
    phone: '555-0103',
    dateOfBirth: new Date('1988-12-10'),
    membershipStatus: 'pending',
    membershipStart: null,
    membershipEnd: null,
  },
  {
    email: 'sarah.williams@example.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Williams',
    phone: '555-0104',
    dateOfBirth: new Date('1992-03-25'),
    membershipStatus: 'pending',
    membershipStart: null,
    membershipEnd: null,
  },
  {
    email: 'david.brown@example.com',
    password: 'password123',
    firstName: 'David',
    lastName: 'Brown',
    phone: '555-0105',
    dateOfBirth: new Date('1987-07-18'),
    membershipStatus: 'expired',
    membershipStart: new Date('2023-01-01'),
    membershipEnd: new Date('2024-01-01'),
  },
  {
    email: 'emily.davis@example.com',
    password: 'password123',
    firstName: 'Emily',
    lastName: 'Davis',
    phone: '555-0106',
    dateOfBirth: new Date('1991-11-30'),
    membershipStatus: 'expired',
    membershipStart: new Date('2023-06-01'),
    membershipEnd: new Date('2024-06-01'),
  },
  {
    email: 'chris.miller@example.com',
    password: 'password123',
    firstName: 'Chris',
    lastName: 'Miller',
    phone: '555-0107',
    dateOfBirth: new Date('1989-04-12'),
    membershipStatus: 'cancelled',
    membershipStart: new Date('2023-03-01'),
    membershipEnd: new Date('2024-03-01'),
  },
  {
    email: 'lisa.wilson@example.com',
    password: 'password123',
    firstName: 'Lisa',
    lastName: 'Wilson',
    phone: '555-0108',
    dateOfBirth: new Date('1993-09-05'),
    membershipStatus: 'active',
    membershipStart: new Date('2024-03-20'),
    membershipEnd: new Date('2025-03-20'),
  },
  {
    email: 'robert.moore@example.com',
    password: 'password123',
    firstName: 'Robert',
    lastName: 'Moore',
    phone: '555-0109',
    dateOfBirth: new Date('1986-01-28'),
    membershipStatus: 'pending',
    membershipStart: null,
    membershipEnd: null,
  },
  {
    email: 'amanda.taylor@example.com',
    password: 'password123',
    firstName: 'Amanda',
    lastName: 'Taylor',
    phone: '555-0110',
    dateOfBirth: new Date('1994-06-14'),
    membershipStatus: 'active',
    membershipStart: new Date('2024-04-10'),
    membershipEnd: new Date('2025-04-10'),
  },
]

export async function POST(request: NextRequest) {
  try {
    const createdMembers = []
    const errors = []

    for (const memberData of sampleMembers) {
      try {
        // Check if member already exists
        const existing = await prisma.user.findUnique({
          where: { email: memberData.email },
        })

        if (existing) {
          errors.push(`Member ${memberData.email} already exists`)
          continue
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(memberData.password, 10)

        // Create member
        const member = await prisma.user.create({
          data: {
            email: memberData.email,
            password: hashedPassword,
            firstName: memberData.firstName,
            lastName: memberData.lastName,
            phone: memberData.phone,
            dateOfBirth: memberData.dateOfBirth,
            membershipStatus: memberData.membershipStatus,
            membershipStart: memberData.membershipStart,
            membershipEnd: memberData.membershipEnd,
          },
        })

        createdMembers.push({
          email: member.email,
          name: `${member.firstName} ${member.lastName}`,
          status: member.membershipStatus,
        })
      } catch (error: any) {
        errors.push(`Failed to create ${memberData.email}: ${error.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      created: createdMembers.length,
      members: createdMembers,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error: any) {
    console.error('Failed to seed members:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to seed members' },
      { status: 500 }
    )
  }
}
