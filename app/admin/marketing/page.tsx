'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface ReferralStat {
  id: string
  name: string
  displayOrder: number
  count: number
}

interface ReferralStatsResponse {
  period: string
  stats: ReferralStat[]
  noSourceCount: number
  total: number
}

export default function MarketingPage() {
  const [stats, setStats] = useState<ReferralStat[]>([])
  const [noSourceCount, setNoSourceCount] = useState(0)
  const [total, setTotal] = useState(0)
  const [period, setPeriod] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [isSeeding, setIsSeeding] = useState(false)

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('admin_auth')
    if (auth !== 'true') {
      window.location.href = '/admin'
      return
    }
    setIsCheckingAuth(false)
    fetchStats()
  }, [period])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      setError('')
      const adminEmail = localStorage.getItem('admin_email') || ''
      
      if (!adminEmail) {
        setError('Not authenticated. Please log in again.')
        return
      }
      
      const response = await fetch(
        `/api/admin/marketing/referral-stats?period=${period}&email=${encodeURIComponent(adminEmail)}`,
        {
          headers: {
            'x-admin-email': adminEmail,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch referral statistics')
      }

      const statsData: ReferralStatsResponse = data
      setStats(statsData.stats)
      setNoSourceCount(statsData.noSourceCount)
      setTotal(statsData.total)
    } catch (error: any) {
      console.error('Failed to fetch stats:', error)
      setError(error.message || 'Failed to load referral statistics')
    } finally {
      setIsLoading(false)
    }
  }

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'all':
        return 'All Time'
      case 'lastYear':
        return 'Last Year'
      case 'last3Months':
        return 'Last 3 Months'
      case 'lastMonth':
        return 'Last Month'
      default:
        return 'All Time'
    }
  }

  const getPercentage = (count: number) => {
    if (total === 0) return '0.0'
    return ((count / total) * 100).toFixed(1)
  }

  const handleSeedData = async () => {
    if (!confirm('This will create 500 test users with random referral sources. Continue?')) {
      return
    }

    setIsSeeding(true)
    setError('')
    setSuccess('')

    try {
      const adminEmail = localStorage.getItem('admin_email') || ''
      const response = await fetch('/api/admin/seed-marketing-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminEmail,
        },
        body: JSON.stringify({ email: adminEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Successfully created ${data.created} test users!`)
        fetchStats() // Refresh stats
        setTimeout(() => setSuccess(''), 5000)
      } else {
        setError(data.error || 'Failed to seed marketing data')
      }
    } catch (error: any) {
      console.error('Failed to seed marketing data:', error)
      setError('Failed to seed marketing data. Please try again.')
    } finally {
      setIsSeeding(false)
    }
  }

  const handleSeedVariedData = async () => {
    if (!confirm('This will create 500 test users with varied distribution (some sources will have many more users than others). Continue?')) {
      return
    }

    setIsSeeding(true)
    setError('')
    setSuccess('')

    try {
      const adminEmail = localStorage.getItem('admin_email') || ''
      const response = await fetch('/api/admin/seed-marketing-data-varied', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminEmail,
        },
        body: JSON.stringify({ email: adminEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Successfully created ${data.created} test users with varied distribution!`)
        fetchStats() // Refresh stats
        setTimeout(() => setSuccess(''), 5000)
      } else {
        setError(data.error || 'Failed to seed varied marketing data')
      }
    } catch (error: any) {
      console.error('Failed to seed varied marketing data:', error)
      setError('Failed to seed varied marketing data. Please try again.')
    } finally {
      setIsSeeding(false)
    }
  }

  // Prepare chart data
  const sortedStats = [...stats].sort((a, b) => b.count - a.count)
  const chartData = [
    ...sortedStats
      .slice(0, 10) // Top 10 for better visualization
      .map((stat) => ({
        id: stat.id,
        name: stat.name.length > 20 ? stat.name.substring(0, 20) + '...' : stat.name,
        fullName: stat.name,
        count: stat.count,
        percentage: parseFloat(getPercentage(stat.count)),
      })),
    ...(noSourceCount > 0 ? [{
      id: 'no-source',
      name: 'No Source',
      fullName: 'No Referral Source',
      count: noSourceCount,
      percentage: parseFloat(getPercentage(noSourceCount)),
    }] : []),
  ]

  // Colors for pie chart
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
    '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0',
    '#FFB347', '#87CEEB', '#DDA0DD', '#F0E68C', '#98D8C8'
  ]

  // Helper function to get color for a referral source
  const getColorForSource = (sourceId: string | null, sourceName: string) => {
    if (sourceId === null || sourceName === 'No Referral Source') {
      const noSourceIndex = chartData.findIndex((item) => item.id === 'no-source' || item.fullName === 'No Referral Source')
      return noSourceIndex >= 0 ? COLORS[noSourceIndex % COLORS.length] : COLORS[0]
    }
    const chartIndex = chartData.findIndex((item) => item.id === sourceId || item.fullName === sourceName)
    if (chartIndex >= 0) {
      return COLORS[chartIndex % COLORS.length]
    }
    // If not in chartData (not top 10), use index from sorted stats
    const sortedIndex = sortedStats.findIndex((stat) => stat.id === sourceId)
    return COLORS[(sortedIndex % COLORS.length)]
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Manage Marketing</h1>
            <p className="text-gray-600 mt-2">View referral source statistics and marketing insights</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSeeding ? 'Creating...' : 'Create 500 Test Users'}
            </button>
            <button
              onClick={handleSeedVariedData}
              disabled={isSeeding}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSeeding ? 'Creating...' : 'Create 500 Varied Users'}
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Referral Source Statistics</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setPeriod('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  period === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => setPeriod('lastYear')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  period === 'lastYear'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Last Year
              </button>
              <button
                onClick={() => setPeriod('last3Months')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  period === 'last3Months'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Last 3 Months
              </button>
              <button
                onClick={() => setPeriod('lastMonth')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  period === 'lastMonth'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Last Month
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading statistics...</p>
            </div>
          ) : (
            <>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Period: <span className="font-semibold">{getPeriodLabel(period)}</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Members: <span className="font-semibold text-lg">{total}</span></p>
                  </div>
                </div>
              </div>

              {stats.length === 0 && noSourceCount === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No referral data found for this period.</p>
                </div>
              ) : (
                <>
                  {/* Charts Section */}
                  {chartData.length > 0 && (
                    <div className="mb-8 grid md:grid-cols-2 gap-6">
                      {/* Bar Chart */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-4 text-center">Top Referral Sources (Bar Chart)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="name" 
                              angle={-45}
                              textAnchor="end"
                              height={100}
                              interval={0}
                              fontSize={10}
                            />
                            <YAxis />
                            <Tooltip 
                              formatter={(value: number) => [value, 'Count']}
                              labelFormatter={(label) => `Source: ${label}`}
                            />
                            <Legend />
                            <Bar dataKey="count" name="Member Count">
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Pie Chart */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-4 text-center">Referral Source Distribution (Pie Chart)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percentage }) => `${name}: ${percentage}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value: number, name: string, props: any) => [
                                `${value} (${props.payload.percentage}%)`,
                                'Count'
                              ]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Table Section */}
                  <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Referral Source
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Count
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Percentage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Visual
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedStats.map((stat) => {
                        const barColor = getColorForSource(stat.id, stat.name)
                        
                        return (
                          <tr key={stat.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {stat.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {stat.count}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {getPercentage(stat.count)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                  className="h-4 rounded-full"
                                  style={{
                                    width: `${getPercentage(stat.count)}%`,
                                    minWidth: stat.count > 0 ? '4px' : '0',
                                    backgroundColor: barColor,
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                      {noSourceCount > 0 && (
                        <tr className="hover:bg-gray-50 bg-yellow-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <span className="italic">No Referral Source</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {noSourceCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getPercentage(noSourceCount)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div
                                className="h-4 rounded-full"
                                style={{
                                  width: `${getPercentage(noSourceCount)}%`,
                                  minWidth: noSourceCount > 0 ? '4px' : '0',
                                  backgroundColor: getColorForSource(null, 'No Referral Source'),
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
