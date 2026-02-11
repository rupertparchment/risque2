'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'

interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  status: string
  stripePaymentId: string | null
  paymentType: string
  eventId: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  event: {
    id: string
    title: string
  } | null
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isSeeding, setIsSeeding] = useState(false)

  useEffect(() => {
    // Check authentication and role
    const auth = localStorage.getItem('admin_auth')
    const role = localStorage.getItem('admin_role')
    
    if (auth !== 'true') {
      window.location.href = '/admin'
      return
    }
    
    if (role !== 'administrator') {
      setError('Access denied. Only administrators can view payments.')
      setIsCheckingAuth(false)
      setIsLoading(false)
      return
    }
    
    setUserRole(role)
    setIsCheckingAuth(false)
    fetchPayments()
  }, [])

  useEffect(() => {
    if (userRole === 'administrator' && !isCheckingAuth) {
      fetchPayments()
    }
  }, [filterStatus, filterType, userRole, isCheckingAuth])

  const fetchPayments = async () => {
    try {
      setIsLoading(true)
      setError('')
      const adminEmail = localStorage.getItem('admin_email') || ''
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterType !== 'all') params.append('type', filterType)
      params.append('email', adminEmail)
      const url = `/api/admin/payments?${params.toString()}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch payments')
      }
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      setPayments(data || [])
    } catch (error: any) {
      console.error('Failed to fetch payments:', error)
      const errorMessage = error.message || 'Failed to load payments. Please refresh the page.'
      setError(errorMessage)
      setPayments([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeedPayments = async () => {
    if (!confirm('This will create 10 random test payments. Continue?')) {
      return
    }

    setIsSeeding(true)
    setError('')
    setSuccess('')

    try {
      const adminEmail = localStorage.getItem('admin_email') || ''
      const response = await fetch('/api/admin/seed-payments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-email': adminEmail,
        },
        body: JSON.stringify({ email: adminEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Successfully created ${data.created} test payments!`)
        fetchPayments()
        setTimeout(() => setSuccess(''), 5000)
      } else {
        setError(data.error || 'Failed to seed payments')
      }
    } catch (error: any) {
      console.error('Failed to seed payments:', error)
      setError('Failed to seed payments. Please try again.')
    } finally {
      setIsSeeding(false)
    }
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'membership':
        return 'bg-blue-100 text-blue-800'
      case 'event':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter by search query
  const filteredPayments = searchQuery.trim() === ''
    ? payments
    : payments.filter((payment) => {
        const query = searchQuery.toLowerCase()
        const userName = `${payment.user.firstName} ${payment.user.lastName}`.toLowerCase()
        const email = payment.user.email.toLowerCase()
        const eventTitle = payment.event?.title.toLowerCase() || ''
        return userName.includes(query) || email.includes(query) || eventTitle.includes(query)
      })

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Checking permissions...</p>
      </div>
    )
  }

  if (userRole !== 'administrator') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border-2 border-red-500 text-red-700 px-6 py-4 rounded-lg">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="mb-4">Only administrators can access the payments management page.</p>
            <Link
              href="/admin"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg inline-block"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Manage Payments</h1>
            <p className="text-gray-600 mt-2">View charges, process refunds, and manage transactions</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSeedPayments}
              disabled={isSeeding}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSeeding ? 'Creating...' : 'Create Test Payments'}
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

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Payments
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by member name, email, or event..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-4 items-center flex-wrap">
              <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            
              <label className="text-sm font-medium text-gray-700">Filter by Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Types</option>
                <option value="membership">Membership</option>
                <option value="event">Event</option>
              </select>
              
              <div className="ml-auto text-sm text-gray-600">
                Showing {filteredPayments.length} of {payments.length} payments
                {searchQuery && (
                  <span className="text-blue-600 ml-2">
                    (filtered by "{searchQuery}")
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Loading payments...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No payments found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto max-w-full">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stripe ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(payment.createdAt), 'MMM d, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.user.firstName} {payment.user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{payment.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(payment.paymentType)}`}>
                          {payment.paymentType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.event ? (
                          <span>{payment.event.title}</span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">
                        {payment.stripePaymentId ? (
                          <a
                            href={`https://dashboard.stripe.com/payments/${payment.stripePaymentId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 hover:underline"
                          >
                            {payment.stripePaymentId.slice(0, 20)}...
                          </a>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex flex-col gap-1">
                          <Link
                            href={`/admin/payments/${payment.id}`}
                            className="text-blue-600 hover:text-blue-900 hover:underline"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => {
                              const adminEmail = localStorage.getItem('admin_email') || ''
                              const url = `/api/admin/payments/${payment.id}/receipt?email=${encodeURIComponent(adminEmail)}`
                              window.open(url, '_blank')
                            }}
                            className="text-green-600 hover:text-green-900 hover:underline text-left"
                          >
                            Print
                          </button>
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
