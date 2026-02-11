import { prisma } from './prisma'

/**
 * Verify that the user is an administrator
 * Returns the admin user if valid, null otherwise
 */
export async function verifyAdminAccess(email?: string | null): Promise<{ id: string; email: string; role: string } | null> {
  if (!email) {
    return null
  }

  try {
    const adminUser = await prisma.adminUser.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        isDeleted: true,
      },
    })

    if (!adminUser || adminUser.isDeleted || !adminUser.isActive) {
      return null
    }

    if (adminUser.role !== 'administrator') {
      return null
    }

    return {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    }
  } catch (error) {
    console.error('Error verifying admin access:', error)
    return null
  }
}
