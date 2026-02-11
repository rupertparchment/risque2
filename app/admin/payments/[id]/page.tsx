'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { useParams, useRouter } from 'next/navigation'

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

export default function PaymentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const paymentId = params.id as string

  const [payment, setPayment] = useState<Payment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [isRefunding, setIsRefunding] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication and role
    const auth = localStorage.getItem('admin_auth')
    const role = localStorage.getItem('admin_role')
    
    if (auth !== 'true') {
      router.push('/admin')
      return
    }
    
    if (role !== 'administrator') {
      setError('Access denied. Only administrators can view payments.')
      setIsLoading(false)
      return
    }
    
    setUserRole(role)
    fetchPayment()
  }, [paymentId, router])

  const fetchPayment = async () => {
    try {
      setIsLoading(true)
      setError('')
      const adminEmail = localStorage.getItem('admin_email') || ''
      const response = await fetch(`/api/admin/payments/${paymentId}?email=${adminEmail}`, {
        headers: {
          'x-admin-email': adminEmail,
        },
      })
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Payment not found')
        } else {
          throw new Error('Failed to fetch payment')
        }
        setIsLoading(false)
        return
      }
      
      const paymentData = await response.json()
      setPayment(paymentData)
    } catch (error: any) {
      console.error('Failed to fetch payment:', error)
      setError(error.message || 'Failed to load payment')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefund = async () => {
    if (!payment) return

    if (!payment.stripePaymentId) {
      setError('No Stripe payment ID found. Cannot process refund.')
      return
    }

    if (payment.status === 'refunded') {
      setError('This payment has already been refunded.')
      return
    }

    if (!confirm(`Are you sure you want to refund $${payment.amount.toFixed(2)} to ${payment.user.firstName} ${payment.user.lastName}?\n\nThis action cannot be undone.`)) {
      return
    }

    setIsRefunding(true)
    setError('')
    setSuccess('')

    try {
      const adminEmail = localStorage.getItem('admin_email') || ''
      const response = await fetch(`/api/admin/payments/${payment.id}/refund`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-email': adminEmail,
        },
        body: JSON.stringify({ email: adminEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Refund processed successfully! Refund ID: ${data.refundId || 'N/A'}`)
        fetchPayment() // Refresh payment data
        setTimeout(() => setSuccess(''), 5000)
      } else {
        setError(data.error || 'Failed to process refund')
      }
    } catch (error: any) {
      console.error('Failed to process refund:', error)
      setError('Failed to process refund. Please try again.')
    } finally {
      setIsRefunding(false)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading payment...</p>
      </div>
    )
  }

  if (userRole !== 'administrator') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border-2 border-red-500 text-red-700 px-6 py-4 rounded-lg">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="mb-4">Only administrators can access payment details.</p>
            <Link
              href="/admin/payments"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg inline-block"
            >
              Back to Payments
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-red-600 mb-4">Payment not found</p>
            <Link href="/admin/payments" className="text-blue-600 hover:underline">
              Back to Payments
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Payment Details</h1>
            <p className="text-gray-600 mt-2">View payment information and process refunds</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const adminEmail = localStorage.getItem('admin_email') || ''
                const url = `/api/admin/payments/${paymentId}/receipt?email=${encodeURIComponent(adminEmail)}`
                window.open(url, '_blank')
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Print Receipt
            </button>
            <Link
              href="/admin/payments"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Back to Payments
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
          <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment ID</label>
                <p className="text-sm text-gray-900 font-mono">{payment.id}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <p className="text-lg font-bold text-gray-900">
                  ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(payment.paymentType)}`}>
                  {payment.paymentType}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <p className="text-sm text-gray-900">
                  {format(new Date(payment.createdAt), 'MMM d, yyyy HH:mm')}
                </p>
              </div>

              {payment.stripePaymentId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Payment ID</label>
                  <a
                    href={`https://dashboard.stripe.com/payments/${payment.stripePaymentId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-900 hover:underline font-mono"
                  >
                    {payment.stripePaymentId}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">Member Information</h2>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-sm text-gray-900">
                  {payment.user.firstName} {payment.user.lastName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-sm text-gray-900">{payment.user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {payment.event && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6">Event Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
              <p className="text-sm text-gray-900">{payment.event.title}</p>
            </div>
          </div>
        )}

        {payment.status === 'completed' && payment.stripePaymentId && payment.status !== 'refunded' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-red-600">Refund Payment</h2>
            <p className="text-gray-600 mb-4">
              Process a refund for this payment. This action cannot be undone.
            </p>
            <div className="bg-yellow-50 border-2 border-yellow-500 p-4 rounded-lg mb-4">
              <p className="font-semibold text-yellow-800 mb-2">⚠️ Warning</p>
              <p className="text-sm text-yellow-700">
                Refunding ${payment.amount.toFixed(2)} to {payment.user.firstName} {payment.user.lastName} ({payment.user.email})
              </p>
            </div>
            <button
              onClick={handleRefund}
              disabled={isRefunding}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRefunding ? 'Processing Refund...' : 'Process Refund'}
            </button>
          </div>
        )}

        {payment.status === 'refunded' && (
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
            <p className="text-gray-600 font-medium">This payment has already been refunded.</p>
          </div>
        )}
      </div>
    </div>
  )
}
