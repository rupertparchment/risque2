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

    // Generate 500 random users with varied distribution
    // Create weighted distribution: some sources will have many more users than others
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

    // Create weighted distribution array
    // First 3 sources get 40%, 30%, 20% of users (350 total)
    // Remaining sources share 10% (50 total)
    // 10% have no source (50 total)
    const totalUsers = 500
    const topSourceCount = Math.floor(totalUsers * 0.40) // 200 users
    const secondSourceCount = Math.floor(totalUsers * 0.30) // 150 users
    const thirdSourceCount = Math.floor(totalUsers * 0.20) // 100 users
    const remainingCount = totalUsers - topSourceCount - secondSourceCount - thirdSourceCount - 50 // 50 for no source
    const remainingPerSource = Math.floor(remainingCount / Math.max(1, referralSources.length - 3))

    let userIndex = 0

    // Assign top 3 sources with high counts
    for (let i = 0; i < Math.min(3, referralSources.length); i++) {
      const count = i === 0 ? topSourceCount : i === 1 ? secondSourceCount : thirdSourceCount
      const referralSourceId = referralSources[i].id

      for (let j = 0; j < count; j++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${userIndex}@${domains[Math.floor(Math.random() * domains.length)]}`
        
        const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime())
        const createdAt = new Date(randomTime)
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
        userIndex++
      }
    }

    // Assign remaining sources with lower counts
    for (let i = 3; i < referralSources.length; i++) {
      const count = remainingPerSource + Math.floor(Math.random() * 5) // Add some randomness
      const referralSourceId = referralSources[i].id

      for (let j = 0; j < count && userIndex < totalUsers - 50; j++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${userIndex}@${domains[Math.floor(Math.random() * domains.length)]}`
        
        const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime())
        const createdAt = new Date(randomTime)
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
        userIndex++
      }
    }

    // Add 50 users with no referral source
    for (let i = 0; i < 50; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${userIndex}@${domains[Math.floor(Math.random() * domains.length)]}`
      
      const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime())
      const createdAt = new Date(randomTime)
      const hashedPassword = await bcrypt.hash('password123', 10)

      users.push({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: `555-${Math.floor(1000 + Math.random() * 9000)}`,
        membershipStatus: Math.random() > 0.3 ? 'active' : 'pending',
        referralSourceId: null,
        receiveEmails: Math.random() > 0.2,
        createdAt,
      })
      userIndex++
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
      message: `Successfully created ${createdUsers.length} test users with varied referral source distribution`,
      created: createdUsers.length,
    })
  } catch (error: any) {
    console.error('Failed to seed varied marketing data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to seed marketing data' },
      { status: 500 }
    )
  }
}
