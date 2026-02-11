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
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedMessage, setSeedMessage] = useState<string>('')

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setIsLoading(true)
      setError('')
      const response = await fetch('/api/admin/members')
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

  const filteredMembers = filterStatus === 'all' 
    ? members 
    : members.filter(m => m.membershipStatus === filterStatus)

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

        {seedMessage && (
          <div className="bg-green-50 border-2 border-green-500 text-green-700 px-4 py-3 rounded mb-4 font-semibold">
            {seedMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-4 items-center">
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
            <div className="ml-auto text-sm text-gray-600">
              Showing {filteredMembers.length} of {members.length} members
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membership Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      RSVPs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </div>
                        {member.phone && (
                          <div className="text-sm text-gray-500">{member.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            member.membershipStatus
                          )}`}
                        >
                          {member.membershipStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.membershipStart ? (
                          <div>
                            <div>Start: {format(new Date(member.membershipStart), 'MMM d, yyyy')}</div>
                            {member.membershipEnd && (
                              <div>End: {format(new Date(member.membershipEnd), 'MMM d, yyyy')}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member._count.payments}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member._count.rsvps}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(member.createdAt), 'MMM d, yyyy')}
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
