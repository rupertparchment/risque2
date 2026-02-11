'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { loadStripe } from '@stripe/stripe-js'

interface ReferralSource {
  id: string
  name: string
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  dateOfBirth: string | null
  addressLine1: string | null
  addressLine2: string | null
  city: string | null
  state: string | null
  zip: string | null
  membershipStatus: string
  membershipStart: string | null
  membershipEnd: string | null
  receiveEmails: boolean
  digitalSignature: string | null
  referralSourceId: string | null
  referralSource: {
    id: string
    name: string
  } | null
}

const membershipSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  receiveEmails: z.boolean().default(true),
  digitalSignature: z.string().min(1, 'Digital signature is required'),
  referralSourceId: z.string().optional(),
})

type MembershipForm = z.infer<typeof membershipSchema>

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function MembershipPage() {
  const [mode, setMode] = useState<'login' | 'signup' | 'profile'>('login')
  const [user, setUser] = useState<User | null>(null)
  const [referralSources, setReferralSources] = useState<ReferralSource[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<MembershipForm>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      receiveEmails: true,
    },
  })

  useEffect(() => {
    checkAuth()
    fetchReferralSources()
  }, [])

  const checkAuth = async () => {
    const userId = localStorage.getItem('user_id')
    const userEmail = localStorage.getItem('user_email')
    
    if (userId && userEmail) {
      try {
        const response = await fetch('/api/membership/profile', {
          headers: {
            'x-user-id': userId,
          },
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setMode('profile')
          // Populate form with user data
          setValue('email', userData.email)
          setValue('firstName', userData.firstName)
          setValue('lastName', userData.lastName)
          setValue('phone', userData.phone || '')
          setValue('dateOfBirth', userData.dateOfBirth || '')
          setValue('addressLine1', userData.addressLine1 || '')
          setValue('addressLine2', userData.addressLine2 || '')
          setValue('city', userData.city || '')
          setValue('state', userData.state || '')
          setValue('zip', userData.zip || '')
          setValue('receiveEmails', userData.receiveEmails !== undefined ? userData.receiveEmails : true)
          setValue('digitalSignature', userData.digitalSignature || '')
          setValue('referralSourceId', userData.referralSourceId || '')
        } else {
          // Invalid session, clear it
          localStorage.removeItem('user_id')
          localStorage.removeItem('user_email')
        }
      } catch (error) {
        console.error('Failed to check auth:', error)
      }
    }
    setIsLoadingProfile(false)
  }

  const fetchReferralSources = async () => {
    try {
      const response = await fetch('/api/admin/referral-sources')
      if (response.ok) {
        const data = await response.json()
        setReferralSources(data || [])
      }
    } catch (error) {
      console.error('Failed to fetch referral sources:', error)
    }
  }

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/membership/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Login failed')
      }

      // Store user session
      localStorage.setItem('user_id', result.user.id)
      localStorage.setItem('user_email', result.user.email)
      
      // Reload profile
      await checkAuth()
      setSuccess('Login successful!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (data: MembershipForm) => {
    setIsLoading(true)
    setError(null)

    // Validate required fields for signup
    if (!data.password || data.password.length < 8) {
      setError('Password is required and must be at least 8 characters')
      setIsLoading(false)
      return
    }

    if (!data.digitalSignature || data.digitalSignature.trim() === '') {
      setError('Digital signature is required')
      setIsLoading(false)
      return
    }

    try {
      // Create membership and get Stripe checkout session
      const response = await fetch('/api/membership/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong')
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe && result.sessionId) {
        await stripe.redirectToCheckout({ sessionId: result.sessionId })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create membership')
      setIsLoading(false)
    }
  }

  const handleProfileUpdate = async (data: MembershipForm) => {
    setIsLoading(true)
    setError(null)

    // Validate digital signature for profile update
    if (!data.digitalSignature || data.digitalSignature.trim() === '') {
      setError('Digital signature is required')
      setIsLoading(false)
      return
    }

    try {
      const userId = localStorage.getItem('user_id')
      if (!userId) {
        throw new Error('Not authenticated')
      }

      // Don't send password if it's empty
      const updateData = { ...data }
      if (!updateData.password || updateData.password.trim() === '') {
        delete updateData.password
      }

      const response = await fetch('/api/membership/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile')
      }

      setUser(result)
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_email')
    setUser(null)
    setMode('login')
    reset()
  }

  const formatPhoneNumber = (phone: string | null): string => {
    if (!phone) return ''
    const digits = phone.replace(/\D/g, '')
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    }
    return phone
  }

  const handlePhoneChange = (value: string, onChange: (value: string) => void) => {
    const digits = value.replace(/\D/g, '')
    const limited = digits.slice(0, 10)
    let formatted = ''
    if (limited.length > 0) {
      formatted = '(' + limited.slice(0, 3)
      if (limited.length > 3) {
        formatted += ') ' + limited.slice(3, 6)
      }
      if (limited.length > 6) {
        formatted += '-' + limited.slice(6)
      }
    }
    onChange(formatted)
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {mode === 'login' && !user && (
            <>
              <h1 className="text-3xl font-bold mb-2">Member Login</h1>
              <p className="text-gray-600 mb-8">
                Sign in to access your membership profile and update your information.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  handleLogin({
                    email: formData.get('email') as string,
                    password: formData.get('password') as string,
                  })
                }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Don't have an account? Apply for membership
                  </button>
                </div>
              </form>
            </>
          )}

          {mode === 'signup' && !user && (
            <>
              <h1 className="text-3xl font-bold mb-2">Become a Member</h1>
              <p className="text-gray-600 mb-8">
                Join Risqué and experience Baltimore&apos;s premier lifestyle club. Fill out the application below.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(handleSignup)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      {...register('firstName')}
                      type="text"
                      id="firstName"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      {...register('lastName')}
                      type="text"
                      id="lastName"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    {...register('password')}
                    type="password"
                    id="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      id="phone"
                      placeholder="(111) 123-4567"
                      onChange={(e) => {
                        handlePhoneChange(e.target.value, (value) => {
                          setValue('phone', value)
                        })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      {...register('dateOfBirth')}
                      type="date"
                      id="dateOfBirth"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1
                  </label>
                  <input
                    {...register('addressLine1')}
                    type="text"
                    id="addressLine1"
                    placeholder="Street address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    {...register('addressLine2')}
                    type="text"
                    id="addressLine2"
                    placeholder="Apartment, suite, etc. (optional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      {...register('city')}
                      type="text"
                      id="city"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      {...register('state')}
                      type="text"
                      id="state"
                      maxLength={2}
                      placeholder="XX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      {...register('zip')}
                      type="text"
                      id="zip"
                      maxLength={10}
                      placeholder="12345"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="receiveEmails" className="block text-sm font-medium text-gray-700 mb-2">
                    Receive Emails *
                  </label>
                  <select
                    {...register('receiveEmails', { valueAsBoolean: true })}
                    id="receiveEmails"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="digitalSignature" className="block text-sm font-medium text-gray-700 mb-2">
                    Digital Signature *
                  </label>
                  <input
                    {...register('digitalSignature')}
                    type="text"
                    id="digitalSignature"
                    placeholder="Enter your full name (membership card owner)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.digitalSignature && (
                    <p className="text-red-500 text-sm mt-1">{errors.digitalSignature.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    This is your digital signature. By adding your name (membership card owner), you are agreeing to our Club Rules.
                  </p>
                </div>

                <div>
                  <label htmlFor="referralSourceId" className="block text-sm font-medium text-gray-700 mb-2">
                    How Did You Hear About Us?
                  </label>
                  <select
                    {...register('referralSourceId')}
                    id="referralSourceId"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select an option...</option>
                    {referralSources.map((source) => (
                      <option key={source.id} value={source.id}>
                        {source.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Membership Fee</h3>
                  <p className="text-2xl font-bold text-primary-600">$500/year</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Includes access to all events and facilities
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Processing...' : 'Continue to Payment'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Already have an account? Login
                  </button>
                </div>
              </form>
            </>
          )}

          {mode === 'profile' && user && (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">My Membership Profile</h1>
                  <p className="text-gray-600">
                    Update your membership information and profile details.
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                  {success}
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Membership Status</h3>
                <p className="text-lg">
                  Status: <span className="font-bold capitalize">{user.membershipStatus}</span>
                </p>
                {user.membershipStart && (
                  <p className="text-sm text-gray-600 mt-1">
                    Member since: {new Date(user.membershipStart).toLocaleDateString()}
                  </p>
                )}
                {user.membershipEnd && (
                  <p className="text-sm text-gray-600">
                    Membership expires: {new Date(user.membershipEnd).toLocaleDateString()}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="profile-firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      {...register('firstName')}
                      type="text"
                      id="profile-firstName"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="profile-lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      {...register('lastName')}
                      type="text"
                      id="profile-lastName"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="profile-email"
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      id="profile-phone"
                      placeholder="(111) 123-4567"
                      onChange={(e) => {
                        handlePhoneChange(e.target.value, (value) => {
                          setValue('phone', value)
                        })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="profile-dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      {...register('dateOfBirth')}
                      type="date"
                      id="profile-dateOfBirth"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="profile-addressLine1" className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1
                  </label>
                  <input
                    {...register('addressLine1')}
                    type="text"
                    id="profile-addressLine1"
                    placeholder="Street address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="profile-addressLine2" className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    {...register('addressLine2')}
                    type="text"
                    id="profile-addressLine2"
                    placeholder="Apartment, suite, etc. (optional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="profile-city" className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      {...register('city')}
                      type="text"
                      id="profile-city"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="profile-state" className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      {...register('state')}
                      type="text"
                      id="profile-state"
                      maxLength={2}
                      placeholder="XX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="profile-zip" className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      {...register('zip')}
                      type="text"
                      id="profile-zip"
                      maxLength={10}
                      placeholder="12345"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="profile-receiveEmails" className="block text-sm font-medium text-gray-700 mb-2">
                    Receive Emails *
                  </label>
                  <select
                    {...register('receiveEmails', { valueAsBoolean: true })}
                    id="profile-receiveEmails"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="profile-digitalSignature" className="block text-sm font-medium text-gray-700 mb-2">
                    Digital Signature *
                  </label>
                  <input
                    {...register('digitalSignature')}
                    type="text"
                    id="profile-digitalSignature"
                    placeholder="Enter your full name (membership card owner)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.digitalSignature && (
                    <p className="text-red-500 text-sm mt-1">{errors.digitalSignature.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    This is your digital signature. By adding your name (membership card owner), you are agreeing to our Club Rules.
                  </p>
                </div>

                <div>
                  <label htmlFor="profile-referralSourceId" className="block text-sm font-medium text-gray-700 mb-2">
                    How Did You Hear About Us?
                  </label>
                  <select
                    {...register('referralSourceId')}
                    id="profile-referralSourceId"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select an option...</option>
                    {referralSources.map((source) => (
                      <option key={source.id} value={source.id}>
                        {source.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
