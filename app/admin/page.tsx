'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('admin_auth', 'true')
        setIsAuthenticated(true)
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('admin_auth')
              setIsAuthenticated(false)
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/admin/events"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-bold mb-2">Manage Events</h2>
            <p className="text-gray-600">Create, edit, and manage events and flyers</p>
          </Link>

          <Link
            href="/admin/gallery"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-bold mb-2">Manage Gallery</h2>
            <p className="text-gray-600">Upload and manage interior photos</p>
          </Link>

          <Link
            href="/admin/members"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-bold mb-2">Manage Members</h2>
            <p className="text-gray-600">View and manage member accounts</p>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-purple-200"
          >
            <h2 className="text-2xl font-bold mb-2">Manage Users</h2>
            <p className="text-gray-600">Manage backend users and assign roles</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
