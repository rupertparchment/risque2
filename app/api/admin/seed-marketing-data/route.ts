import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/admin-auth'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Check authorization - get email from header or body
    const body = await request.json().catch(() => ({}))
    const email = request.headers.get('x-admin-email') || body.email
    
    // Check if it's env var login
    const adminEmail = process.env.ADMIN_EMAIL
    const isEnvVarLogin = email === adminEmail
    
    // If not env var login, verify via AdminUser table
    if (!isEnvVarLogin) {
      const adminUser = await verifyAdminAccess(email)
      if (!adminUser) {
        return NextResponse.json(
          { error: 'Unauthorized. Administrator access required.' },
          { status: 403 }
        )
      }
    }

    // Get all active referral sources
    const referralSources = await prisma.referralSource.findMany({
      where: { isActive: true },
      select: { id: true },
    })

    if (referralSources.length === 0) {
      return NextResponse.json(
        { error: 'No referral sources found. Please create referral sources first.' },
        { status: 400 }
      )
    }

    // Generate 500 random users with referral sources
    const users = []
    const firstNames = [
      'John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Chris', 'Jessica',
      'Michael', 'Amanda', 'James', 'Lisa', 'Robert', 'Jennifer', 'William',
      'Michelle', 'Richard', 'Kimberly', 'Joseph', 'Amy', 'Thomas', 'Angela',
      'Charles', 'Melissa', 'Daniel', 'Deborah', 'Matthew', 'Stephanie',
      'Anthony', 'Rebecca', 'Mark', 'Sharon', 'Donald', 'Laura', 'Steven',
      'Donna', 'Paul', 'Carol', 'Andrew', 'Nancy', 'Joshua', 'Betty',
      'Kenneth', 'Barbara', 'Kevin', 'Elizabeth', 'Brian', 'Helen', 'George',
      'Sandra', 'Edward', 'Donna', 'Ronald', 'Ashley', 'Timothy', 'Kim',
      'Jason', 'Deborah', 'Jeffrey', 'Rachel', 'Ryan', 'Cynthia', 'Jacob',
      'Kathleen', 'Gary', 'Amy', 'Nicholas', 'Shirley', 'Eric', 'Anna',
      'Jonathan', 'Brenda', 'Stephen', 'Pamela', 'Larry', 'Emma', 'Justin',
      'Catherine', 'Scott', 'Frances', 'Brandon', 'Christine', 'Benjamin',
      'Samantha', 'Samuel', 'Debra', 'Frank', 'Rachel', 'Gregory', 'Carolyn',
      'Raymond', 'Janet', 'Alexander', 'Virginia', 'Patrick', 'Maria', 'Jack',
      'Heather', 'Dennis', 'Diane', 'Jerry', 'Julie', 'Tyler', 'Joyce',
      'Aaron', 'Victoria', 'Jose', 'Kelly', 'Henry', 'Christina', 'Adam',
      'Joan', 'Douglas', 'Evelyn', 'Nathan', 'Judith', 'Zachary', 'Megan',
      'Kyle', 'Cheryl', 'Noah', 'Andrea', 'Ethan', 'Hannah', 'Jeremy', 'Jacqueline'
    ]

    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
      'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson',
      'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee',
      'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis',
      'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott',
      'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson',
      'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
      'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz',
      'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
      'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson',
      'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward',
      'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett',
      'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo',
      'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'
    ]

    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com']

    // Generate random dates within the last 2 years
    const now = new Date()
    const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate())

    for (let i = 0; i < 500; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${domains[Math.floor(Math.random() * domains.length)]}`
      
      // Random referral source (including null for some users)
      const referralSourceId = Math.random() < 0.15 
        ? null 
        : referralSources[Math.floor(Math.random() * referralSources.length)].id

      // Random date within the last 2 years
      const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime())
      const createdAt = new Date(randomTime)

      // Hash a default password
      const hashedPassword = await bcrypt.hash('password123', 10)

      users.push({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: `555-${Math.floor(1000 + Math.random() * 9000)}`,
        membershipStatus: Math.random() > 0.3 ? 'active' : 'pending',
        referralSourceId,
        receiveEmails: Math.random() > 0.2,
        createdAt,
      })
    }

    // Insert users in batches to avoid overwhelming the database
    const batchSize = 50
    const createdUsers = []
    
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize)
      const result = await prisma.user.createMany({
        data: batch,
        skipDuplicates: true,
      })
      createdUsers.push(...batch.slice(0, result.count))
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdUsers.length} test users with referral sources`,
      created: createdUsers.length,
    })
  } catch (error: any) {
    console.error('Failed to seed marketing data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to seed marketing data' },
      { status: 500 }
    )
  }
}
