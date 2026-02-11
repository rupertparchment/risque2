import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeDeleted = searchParams.get('includeDeleted') === 'true'

    const users = await prisma.adminUser.findMany({
      where: includeDeleted
        ? {}
        : {
            isDeleted: false,
          },
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json(users)
  } catch (error: any) {
    console.error('Failed to fetch admin users:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch admin users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, role } = body

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['administrator', 'editor', 'viewer']
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Role must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existing = await prisma.adminUser.findUnique({
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

    // Create admin user
    const user = await prisma.adminUser.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'editor',
      },
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
    console.error('Failed to create admin user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create admin user' },
      { status: 500 }
    )
  }
}
