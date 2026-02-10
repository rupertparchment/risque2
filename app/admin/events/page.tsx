'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'

interface Event {
  id: string
  title: string
  description: string
  eventDate: string
  eventTime: string
  eventType: string
  theme?: string
  flyerImage?: string
  interiorImage?: string
  capacity: number
  price: number
  isActive: boolean
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isEditing, setIsEditing] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events')
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    }
  }

  const { register, handleSubmit, reset, setValue } = useForm<Event>()

  const onSubmit = async (data: Event) => {
    setIsLoading(true)
    try {
      const url = isEditing
        ? `/api/admin/events/${isEditing.id}`
        : '/api/admin/events'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        fetchEvents()
        reset()
        setIsEditing(null)
      }
    } catch (error) {
      console.error('Failed to save event:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (event: Event) => {
    setIsEditing(event)
    setValue('title', event.title)
    setValue('description', event.description)
    setValue('eventDate', event.eventDate.split('T')[0])
    setValue('eventTime', event.eventTime)
    setValue('eventType', event.eventType)
    setValue('theme', event.theme || '')
    setValue('capacity', event.capacity)
    setValue('price', event.price)
    setValue('isActive', event.isActive)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchEvents()
      }
    } catch (error) {
      console.error('Failed to delete event:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Manage Events</h1>
          <button
            onClick={() => {
              reset()
              setIsEditing(null)
            }}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
          >
            {isEditing ? 'Cancel Edit' : 'New Event'}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">
                {isEditing ? 'Edit Event' : 'Create New Event'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    {...register('title', { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register('description', { required: true })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      {...register('eventDate', { required: true })}
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      {...register('eventTime', { required: true })}
                      type="time"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    {...register('eventType', { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="regular">Regular</option>
                    <option value="themed">Themed</option>
                    <option value="special">Special</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme (for themed events)
                  </label>
                  <input
                    {...register('theme')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity *
                    </label>
                    <input
                      {...register('capacity', { required: true, valueAsNumber: true })}
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (per couple) *
                    </label>
                    <input
                      {...register('price', { required: true, valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flyer Image URL
                  </label>
                  <input
                    {...register('flyerImage')}
                    type="url"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interior Image URL
                  </label>
                  <input
                    {...register('interiorImage')}
                    type="url"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    {...register('isActive')}
                    type="checkbox"
                    id="isActive"
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active (visible on website)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Existing Events</h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{event.title}</h3>
                      <p className="text-gray-600 mt-1">{event.description}</p>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>
                          <strong>Date:</strong> {format(new Date(event.eventDate), 'MMM d, yyyy')}
                        </span>
                        <span>
                          <strong>Time:</strong> {event.eventTime}
                        </span>
                        <span>
                          <strong>Price:</strong> ${event.price.toFixed(2)}
                        </span>
                        <span>
                          <strong>Capacity:</strong> {event.capacity}
                        </span>
                        {event.theme && (
                          <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded">
                            {event.theme}
                          </span>
                        )}
                        <span className={event.isActive ? 'text-green-600' : 'text-red-600'}>
                          {event.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(event)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
