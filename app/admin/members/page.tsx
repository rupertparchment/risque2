'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'

interface Member {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  dateOfBirth: Date | null
  membershipStatus: string
  membershipStart: Date | null
  membershipEnd: Date | null
  stripeCustomerId: string | null
  isDeleted?: boolean
  deletedAt?: Date | null
  createdAt: Date
  updatedAt: Date
  _count: {
    payments: number
    rsvps: number
  }
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedMessage, setSeedMessage] = useState<string>('')
  const [isEditing, setIsEditing] = useState<Member | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleted, setShowDeleted] = useState(false)
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<string>('desc')
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    membershipStatus: 'pending',
    membershipStart: '',
    membershipEnd: '',
  })

  const fetchMembers = async () => {
    try {
      setIsLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (showDeleted) params.append('includeDeleted', 'true')
      params.append('sortBy', sortBy)
      params.append('sortOrder', sortOrder)
      const url = `/api/admin/members?${params.toString()}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch members')
      }
      const data = await response.json()
      setMembers(data || [])
    } catch (error) {
      console.error('Failed to fetch members:', error)
      setError('Failed to load members. Please refresh the page.')
      setMembers([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [showDeleted, sortBy, sortOrder])

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
      membershipStatus: 'pending',
      membershipStart: '',
      membershipEnd: '',
    })
    setIsEditing(null)
    setIsCreating(false)
  }

  // Helper to format date for input field (handles timezone correctly)
  const formatDateForInput = (date: Date | string | null): string => {
    if (!date) return ''
    const d = typeof date === 'string' ? new Date(date) : date
    // Get local date components to avoid timezone issues
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleEdit = (member: Member) => {
    setIsEditing(member)
    setIsCreating(false)
    setFormData({
      email: member.email,
      password: '', // Don't pre-fill password
      firstName: member.firstName,
      lastName: member.lastName,
      phone: member.phone || '',
      dateOfBirth: formatDateForInput(member.dateOfBirth),
      membershipStatus: member.membershipStatus,
      membershipStart: formatDateForInput(member.membershipStart),
      membershipEnd: formatDateForInput(member.membershipEnd),
    })
  }

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to disable ${email}?\n\nThis will hide them from the member list but preserve all their data (payments, RSVPs, etc.). You can restore them later if needed.`)) return

    try {
      const response = await fetch(`/api/admin/members/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSuccess('Member disabled successfully! (Data preserved, can be restored later)')
        fetchMembers()
        setTimeout(() => setSuccess(''), 5000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to disable member')
      }
    } catch (error) {
      console.error('Failed to disable member:', error)
      setError('Failed to disable member. Please try again.')
    }
  }

  const handleRestore = async (id: string, email: string) => {
    if (!confirm(`Restore ${email}? They will be visible in the member list again.`)) return

    try {
      const response = await fetch(`/api/admin/members/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore' }),
      })

      if (response.ok) {
        setSuccess('Member restored successfully!')
        fetchMembers()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to restore member')
      }
    } catch (error) {
      console.error('Failed to restore member:', error)
      setError('Failed to restore member. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const url = isEditing
        ? `/api/admin/members/${isEditing.id}`
        : '/api/admin/members'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(isEditing ? 'Member updated successfully!' : 'Member created successfully!')
        resetForm()
        fetchMembers()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || `Failed to ${isEditing ? 'update' : 'create'} member`)
      }
    } catch (error) {
      console.error('Failed to save member:', error)
      setError(`Failed to ${isEditing ? 'update' : 'create'} member. Please try again.`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSeedMembers = async () => {
    const forceRecreate = confirm(
      'This will create 10 sample members.\n\n' +
      'Some members may already exist. Do you want to recreate them?\n\n' +
      'OK = Recreate existing members\n' +
      'Cancel = Skip existing members'
    )

    setIsSeeding(true)
    setSeedMessage('')
    setError('')

    try {
      const response = await fetch('/api/admin/seed-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force: forceRecreate }),
      })

      const data = await response.json()

      if (response.ok) {
        let message = `✅ Successfully created ${data.created} sample members!`
        if (data.skipped && data.skipped > 0) {
          message += `\n⏭️ Skipped ${data.skipped} existing members.`
        }
        setSeedMessage(message)
        fetchMembers() // Refresh the list
        setTimeout(() => setSeedMessage(''), 8000)
      } else {
        setError(data.error || 'Failed to seed members')
      }
    } catch (error) {
      console.error('Failed to seed members:', error)
      setError('Failed to seed members. Please try again.')
    } finally {
      setIsSeeding(false)
    }
  }

  // Filter by status, and separate deleted/active members
  const activeMembers = members.filter(m => !m.isDeleted)
  const deletedMembers = members.filter(m => m.isDeleted)
  
  const membersToShow = showDeleted ? deletedMembers : activeMembers
  
  const filteredMembers = filterStatus === 'all' 
    ? membersToShow 
    : membersToShow.filter(m => m.membershipStatus === filterStatus)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateMembershipDuration = (startDate: Date | null, endDate: Date | null) => {
    if (!startDate) return 'Not a member yet'
    
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date() // Use current date if no end date
    const now = new Date()
    
    // Use end date if it's in the past, otherwise use current date
    const referenceDate = end < now ? end : now
    
    if (referenceDate < start) return 'Not started'
    
    const years = referenceDate.getFullYear() - start.getFullYear()
    const months = referenceDate.getMonth() - start.getMonth()
    
    let totalMonths = years * 12 + months
    
    // Adjust if day hasn't passed yet this month
    if (referenceDate.getDate() < start.getDate()) {
      totalMonths--
    }
    
    const finalYears = Math.floor(totalMonths / 12)
    const finalMonths = totalMonths % 12
    
    if (finalYears === 0 && finalMonths === 0) {
      return 'Less than 1 month'
    }
    
    const parts = []
    if (finalYears > 0) {
      parts.push(`${finalYears} ${finalYears === 1 ? 'year' : 'years'}`)
    }
    if (finalMonths > 0) {
      parts.push(`${finalMonths} ${finalMonths === 1 ? 'month' : 'months'}`)
    }
    
    return parts.join(', ')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Manage Members</h1>
            <p className="text-gray-600 mt-2">View and manage member accounts</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                resetForm()
                setIsCreating(true)
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
            >
              + New Member
            </button>
            <button
              onClick={handleSeedMembers}
              disabled={isSeeding}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSeeding ? 'Creating...' : 'Create Sample Members'}
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

        {seedMessage && (
          <div className="bg-green-50 border-2 border-green-500 text-green-700 px-4 py-3 rounded mb-4 font-semibold whitespace-pre-line">
            {seedMessage}
          </div>
        )}

        {/* Create/Edit Form */}
        {(isCreating || isEditing) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? 'Edit Member' : 'Create New Member'}
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
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Membership Status *
                  </label>
                  <select
                    value={formData.membershipStatus}
                    onChange={(e) => setFormData({ ...formData, membershipStatus: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Membership Start
                  </label>
                  <input
                    type="date"
                    value={formData.membershipStart}
                    onChange={(e) => setFormData({ ...formData, membershipStart: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Membership End
                  </label>
                  <input
                    type="date"
                    value={formData.membershipEnd}
                    onChange={(e) => setFormData({ ...formData, membershipEnd: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : isEditing ? 'Update Member' : 'Create Member'}
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
          <div className="flex gap-4 items-center flex-wrap">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Members</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="createdAt">Date Joined</option>
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
            </select>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="asc">Ascending (A-Z)</option>
              <option value="desc">Descending (Z-A)</option>
            </select>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showDeleted"
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="showDeleted" className="text-sm font-medium text-gray-700">
                Show Disabled Members
              </label>
            </div>
            
            <div className="ml-auto text-sm text-gray-600">
              Showing {filteredMembers.length} of {showDeleted ? deletedMembers.length : activeMembers.length} {showDeleted ? 'disabled' : 'active'} members
              {deletedMembers.length > 0 && !showDeleted && (
                <span className="text-orange-600 ml-2">
                  ({deletedMembers.length} disabled)
                </span>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Loading members...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No members found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-visible">
              <table className="w-full divide-y divide-gray-200 table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membership Period
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member Since
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payments
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      RSVPs
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr 
                      key={member.id} 
                      className={`hover:bg-gray-50 ${member.isDeleted ? 'bg-gray-100 opacity-75' : ''}`}
                    >
                      <td className="px-3 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </div>
                        {member.phone && (
                          <div className="text-sm text-gray-500">{member.phone}</div>
                        )}
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-sm text-gray-900 break-words max-w-xs">{member.email}</div>
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            member.membershipStatus
                          )}`}
                        >
                          {member.membershipStatus}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {member.membershipStart ? (
                          <div className="text-xs">
                            <div>Start: {format(new Date(member.membershipStart), 'MMM d, yyyy')}</div>
                            {member.membershipEnd && (
                              <div>End: {format(new Date(member.membershipEnd), 'MMM d, yyyy')}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Not set</span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="font-medium text-xs">
                          {calculateMembershipDuration(member.membershipStart, member.membershipEnd)}
                        </div>
                        {member.membershipStart && (
                          <div className="text-xs text-gray-400 mt-1">
                            Since {format(new Date(member.membershipStart), 'MMM yyyy')}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 text-center">
                        {member._count.payments}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 text-center">
                        {member._count.rsvps}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {format(new Date(member.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-3 py-4 text-sm font-medium">
                        <div className="flex gap-2">
                          {!member.isDeleted ? (
                            <>
                              <button
                                onClick={() => handleEdit(member)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(member.id, member.email)}
                                className="text-red-600 hover:text-red-900"
                                title="Disable member (preserves all data)"
                              >
                                Disable
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleRestore(member.id, member.email)}
                                className="text-green-600 hover:text-green-900 font-semibold"
                                title="Restore member"
                              >
                                Restore
                              </button>
                              {member.deletedAt && (
                                <span className="text-xs text-gray-500">
                                  Disabled {format(new Date(member.deletedAt), 'MMM d, yyyy')}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
