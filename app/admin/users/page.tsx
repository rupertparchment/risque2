'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'

interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  isDeleted?: boolean
  deletedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

const ROLE_DESCRIPTIONS = {
  administrator: 'Full access to all features',
  editor: 'Can manage events and gallery, view members',
  viewer: 'Read-only access, can view but not edit',
}

const ROLE_COLORS = {
  administrator: 'bg-purple-100 text-purple-800',
  editor: 'bg-blue-100 text-blue-800',
  viewer: 'bg-gray-100 text-gray-800',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [showDeleted, setShowDeleted] = useState(false)
  const [isEditing, setIsEditing] = useState<AdminUser | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'editor',
    isActive: true,
  })

  useEffect(() => {
    // Get current logged-in user info
    const email = localStorage.getItem('admin_email')
    const role = localStorage.getItem('admin_role')
    setCurrentUserEmail(email)
    setCurrentUserRole(role)
    fetchUsers()
  }, [showDeleted])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError('')
      const url = showDeleted ? '/api/admin/users?includeDeleted=true' : '/api/admin/users'
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setError('Failed to load users. Please refresh the page.')
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'editor',
      isActive: true,
    })
    setIsEditing(null)
    setIsCreating(false)
  }

  const handleEdit = (user: AdminUser) => {
    setIsEditing(user)
    setIsCreating(false)
    setFormData({
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
    })
  }

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to disable ${email}?`)) return

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSuccess('User disabled successfully!')
        fetchUsers()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to disable user')
      }
    } catch (error) {
      console.error('Failed to disable user:', error)
      setError('Failed to disable user. Please try again.')
    }
  }

  const handleRestore = async (id: string, email: string) => {
    if (!confirm(`Restore ${email}?`)) return

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore' }),
      })

      if (response.ok) {
        setSuccess('User restored successfully!')
        fetchUsers()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to restore user')
      }
    } catch (error) {
      console.error('Failed to restore user:', error)
      setError('Failed to restore user. Please try again.')
    }
  }

  const handlePermanentDelete = async (id: string, email: string) => {
    if (!confirm(`⚠️ WARNING: This will PERMANENTLY delete ${email}.\n\nThis action cannot be undone. All data associated with this user will be permanently removed.\n\nAre you absolutely sure?`)) return

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'permanentDelete' }),
      })

      if (response.ok) {
        setSuccess('User permanently deleted successfully!')
        fetchUsers()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      setError('Failed to delete user. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const url = isEditing
        ? `/api/admin/users/${isEditing.id}`
        : '/api/admin/users'
      const method = isEditing ? 'PUT' : 'POST'

      const currentEmail = localStorage.getItem('admin_email') || ''
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-email': currentEmail,
        },
        body: JSON.stringify({
          ...formData,
          requesterEmail: currentEmail,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(isEditing ? 'User updated successfully!' : 'User created successfully!')
        resetForm()
        fetchUsers()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || `Failed to ${isEditing ? 'update' : 'create'} user`)
      }
    } catch (error) {
      console.error('Failed to save user:', error)
      setError(`Failed to ${isEditing ? 'update' : 'create'} user. Please try again.`)
    } finally {
      setIsSaving(false)
    }
  }

  const activeUsers = users.filter(u => !u.isDeleted)
  const deletedUsers = users.filter(u => u.isDeleted)
  const usersToShow = showDeleted ? deletedUsers : activeUsers

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Manage Admin Users</h1>
            <p className="text-gray-600 mt-2">Manage backend users and assign roles</p>
            {currentUserEmail && (
              <p className="text-sm text-gray-500 mt-1">
                Logged in as: <span className="font-medium">{currentUserEmail}</span>
                {currentUserRole && (
                  <span className="ml-2">({currentUserRole})</span>
                )}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                resetForm()
                setIsCreating(true)
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
            >
              + New User
            </button>
            <Link
              href="/admin"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 rounded mb-4 font-semibold">
            ⚠️ Error: {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-2 border-green-500 text-green-700 px-4 py-3 rounded mb-4 font-semibold">
            ✅ {success}
          </div>
        )}

        {/* Create/Edit Form */}
        {(isCreating || isEditing) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? 'Edit User' : 'Create New User'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                    disabled={!!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password {isEditing ? '(leave blank to keep current)' : '*'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                    disabled={isEditing && currentUserRole !== 'administrator'}
                  >
                    <option value="administrator">Administrator</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {ROLE_DESCRIPTIONS[formData.role as keyof typeof ROLE_DESCRIPTIONS]}
                  </p>
                  {isEditing && currentUserRole !== 'administrator' && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      ⚠️ Only administrators can change roles. You can edit other fields but not the role.
                    </p>
                  )}
                  {isEditing && currentUserRole === 'administrator' && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ You can change roles as an administrator.
                    </p>
                  )}
                </div>
                {isEditing && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Active (can log in)
                    </label>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showDeletedUsers"
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="showDeletedUsers" className="text-sm font-medium text-gray-700">
                Show Disabled Users
              </label>
            </div>
            <div className="ml-auto text-sm text-gray-600">
              {usersToShow.length} {showDeleted ? 'disabled' : 'active'} user{usersToShow.length !== 1 ? 's' : ''}
              {deletedUsers.length > 0 && !showDeleted && (
                <span className="text-orange-600 ml-2">
                  ({deletedUsers.length} disabled)
                </span>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : usersToShow.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No users found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usersToShow.map((user) => {
                    const isCurrentUser = user.email === currentUserEmail
                    return (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-gray-50 ${user.isDeleted ? 'bg-gray-100 opacity-75' : ''} ${isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs font-semibold text-blue-600">(You)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ROLE_COLORS[user.role as keyof typeof ROLE_COLORS] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.role}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {ROLE_DESCRIPTIONS[user.role as keyof typeof ROLE_DESCRIPTIONS]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isDeleted ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Disabled
                          </span>
                        ) : user.isActive ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(user.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {!user.isDeleted ? (
                            <>
                              <button
                                onClick={() => handleEdit(user)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                {isCurrentUser ? 'Edit My Profile' : 'Edit'}
                              </button>
                              {!isCurrentUser && (
                                <button
                                  onClick={() => handleDelete(user.id, user.email)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Disable
                                </button>
                              )}
                              {isCurrentUser && (
                                <span className="text-xs text-gray-500">(Cannot disable yourself)</span>
                              )}
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleRestore(user.id, user.email)}
                                className="text-green-600 hover:text-green-900 font-semibold"
                              >
                                Restore
                              </button>
                              <button
                                onClick={() => handlePermanentDelete(user.id, user.email)}
                                className="text-red-600 hover:text-red-900 font-semibold"
                                title="Permanently delete user (cannot be undone)"
                              >
                                Delete
                              </button>
                              {user.deletedAt && (
                                <span className="text-xs text-gray-500">
                                  Disabled {format(new Date(user.deletedAt), 'MMM d, yyyy')}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
