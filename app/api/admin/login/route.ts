import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Try AdminUser table first (preferred method)
    try {
      const adminUser = await prisma.adminUser.findUnique({
        where: { email },
      })

      if (adminUser && !adminUser.isDeleted && adminUser.isActive) {
        const isValid = await bcrypt.compare(password, adminUser.password)
        if (isValid) {
          return NextResponse.json({ 
            success: true,
            user: {
              email: adminUser.email,
              firstName: adminUser.firstName,
              lastName: adminUser.lastName,
              role: adminUser.role,
            }
          })
        }
      }
    } catch (dbError) {
      // If AdminUser table doesn't exist or query fails, fall back to env vars
      console.log('AdminUser lookup failed, falling back to env vars:', dbError)
    }

    // Fallback to environment variables (for backward compatibility)
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (email === adminEmail && password === adminPassword) {
      return NextResponse.json({ 
        success: true,
        user: {
          email: email,
          firstName: 'Administrator',
          lastName: '',
          role: 'administrator', // Env var login defaults to administrator
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
