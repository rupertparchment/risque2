'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  description: string
  eventDate: string
  eventType: string
  theme?: string
  flyerImage?: string
  interiorImage?: string
  price?: number
  priceCouple?: number
  priceMale?: number
  priceFemale?: number
  totalCouples?: number
  totalMales?: number
  totalFemales?: number
  isActive: boolean
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isEditing, setIsEditing] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [uploadingFlyer, setUploadingFlyer] = useState(false)
  const [selectedFlyerFile, setSelectedFlyerFile] = useState<File | null>(null)
  const [previewFlyerUrl, setPreviewFlyerUrl] = useState<string>('')
  const [showPastEvents, setShowPastEvents] = useState(true)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const { register, handleSubmit, reset, setValue } = useForm<Event>()

  useEffect(() => {
    fetchEvents()
  }, [])

  // Sync form values when editing
  useEffect(() => {
    if (isEditing) {
      setValue('title', isEditing.title || '')
      setValue('description', isEditing.description || '')
      
      // Handle eventDate
      let dateValue = ''
      if (typeof isEditing.eventDate === 'string') {
        dateValue = isEditing.eventDate.split('T')[0]
      } else if (isEditing.eventDate instanceof Date) {
        dateValue = isEditing.eventDate.toISOString().split('T')[0]
      } else {
        const date = new Date(isEditing.eventDate)
        if (!isNaN(date.getTime())) {
          dateValue = date.toISOString().split('T')[0]
        }
      }
      setValue('eventDate', dateValue)
      
      setValue('eventType', isEditing.eventType || 'regular')
      setValue('theme', isEditing.theme || '')
      setValue('flyerImage', isEditing.flyerImage || '')
      setValue('priceCouple', isEditing.priceCouple || 0)
      setValue('priceMale', isEditing.priceMale || 0)
      setValue('priceFemale', isEditing.priceFemale || 0)
      setValue('totalCouples', isEditing.totalCouples || 0)
      setValue('totalMales', isEditing.totalMales || 0)
      setValue('totalFemales', isEditing.totalFemales || 0)
      setValue('isActive', isEditing.isActive !== undefined ? isEditing.isActive : true)
    }
  }, [isEditing, setValue])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events')
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    }
  }

  // Helper to parse date string as local date (avoid timezone issues)
  const parseLocalDate = (dateString: string): Date => {
    // If dateString is in YYYY-MM-DD format, parse it as local date
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
      const [year, month, day] = dateString.split('T')[0].split('-').map(Number)
      return new Date(year, month - 1, day)
    }
    // Otherwise, parse normally
    return new Date(dateString)
  }

  // Helper to format date consistently
  const formatEventDate = (dateString: string): string => {
    const date = parseLocalDate(dateString)
    return format(date, 'EEEE, MMM d, yyyy')
  }

  // Helper to check if event is in the past
  const isPastEvent = (eventDate: string): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const event = parseLocalDate(eventDate)
    event.setHours(0, 0, 0, 0)
    return event < today
  }

  // Filter events based on showPastEvents toggle
  const dateFilteredEvents = showPastEvents 
    ? events 
    : events.filter(event => !isPastEvent(event.eventDate))

  // Filter by search query (search in title, description, theme)
  const filteredEvents = searchQuery.trim() === ''
    ? dateFilteredEvents
    : dateFilteredEvents.filter(event => {
        const query = searchQuery.toLowerCase()
        const title = (event.title || '').toLowerCase()
        const description = (event.description || '').toLowerCase()
        const theme = (event.theme || '').toLowerCase()
        return title.includes(query) || description.includes(query) || theme.includes(query)
      })

  const handleUpload = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Upload failed')
    }

    const data = await response.json()
    return data.url
  }

  const handleFlyerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFlyerFile(file)
      setPreviewFlyerUrl(URL.createObjectURL(file))
      setValue('flyerImage', '') // Clear URL field when file is selected
      setError('')
    }
  }


  const onSubmit = async (data: Event) => {
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      let flyerImageUrl = data.flyerImage || ''

      // Upload flyer image if selected
      if (selectedFlyerFile) {
        setUploadingFlyer(true)
        try {
          flyerImageUrl = await handleUpload(selectedFlyerFile)
        } catch (uploadError: any) {
          setError(`Flyer upload failed: ${uploadError.message}`)
          setIsLoading(false)
          setUploadingFlyer(false)
          return
        } finally {
          setUploadingFlyer(false)
        }
      } else if (data.flyerImage?.trim()) {
        flyerImageUrl = data.flyerImage.trim()
        // Convert Imgur album/page URLs to direct image URLs
        if (flyerImageUrl.includes('imgur.com/') && !flyerImageUrl.includes('i.imgur.com')) {
          const imgurId = flyerImageUrl.split('imgur.com/')[1]?.split('/')[0]?.split('?')[0]
          if (imgurId) {
            flyerImageUrl = `https://i.imgur.com/${imgurId}.jpg`
          }
        }
      }

      const url = isEditing
        ? `/api/admin/events/${isEditing.id}`
        : '/api/admin/events'
      const method = isEditing ? 'PUT' : 'POST'

      // Handle price values - convert empty strings to null, but keep 0 as 0
      const parsePriceValue = (value: any): number | null => {
        if (value === null || value === undefined || value === '') return null
        const num = typeof value === 'string' ? parseFloat(value) : value
        return isNaN(num) ? null : num
      }

      // Handle attendance values
      const parseAttendanceValue = (value: any): number => {
        if (value === null || value === undefined || value === '') return 0
        const num = typeof value === 'string' ? parseInt(value, 10) : value
        return isNaN(num) ? 0 : num
      }

      const submitData = {
        ...data,
        flyerImage: flyerImageUrl || null,
        interiorImage: null,
        priceCouple: parsePriceValue(data.priceCouple),
        priceMale: parsePriceValue(data.priceMale),
        priceFemale: parsePriceValue(data.priceFemale),
        totalCouples: parseAttendanceValue(data.totalCouples),
        totalMales: parseAttendanceValue(data.totalMales),
        totalFemales: parseAttendanceValue(data.totalFemales),
        isActive: data.isActive === true || data.isActive === 'on' || data.isActive === undefined,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        setSuccess(isEditing ? 'Event updated successfully!' : 'Event created successfully!')
        fetchEvents()
        reset()
        setSelectedFlyerFile(null)
        setPreviewFlyerUrl('')
        setIsEditing(null)
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const result = await response.json()
        setError(result.error || 'Failed to save event')
      }
    } catch (error) {
      console.error('Failed to save event:', error)
      setError('Failed to save event. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const populateForm = (event: Event, isEdit: boolean = false) => {
    setSelectedFlyerFile(null)
    setPreviewFlyerUrl('')
    setError('')
    setSuccess('')
    
    setValue('title', event.title || '')
    setValue('description', event.description || '')
    
    // Handle eventDate - it might be a string or Date object
    let dateValue = ''
    if (typeof event.eventDate === 'string') {
      dateValue = event.eventDate.split('T')[0]
    } else if (event.eventDate instanceof Date) {
      dateValue = event.eventDate.toISOString().split('T')[0]
    } else {
      // Fallback: try to parse it
      const date = new Date(event.eventDate)
      if (!isNaN(date.getTime())) {
        dateValue = date.toISOString().split('T')[0]
      }
    }
    setValue('eventDate', dateValue)
    
    setValue('eventType', event.eventType || 'regular')
    setValue('theme', event.theme || '')
    setValue('flyerImage', event.flyerImage || '')
    setValue('priceCouple', event.priceCouple || 0)
    setValue('priceMale', event.priceMale || 0)
    setValue('priceFemale', event.priceFemale || 0)
    setValue('totalCouples', event.totalCouples || 0)
    setValue('totalMales', event.totalMales || 0)
    setValue('totalFemales', event.totalFemales || 0)
    setValue('isActive', event.isActive !== undefined ? event.isActive : true)
    
    // Scroll to form
    setTimeout(() => {
      const formElement = document.querySelector('.bg-white.rounded-lg.shadow-lg.p-6')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleEdit = (event: Event) => {
    try {
      console.log('Editing event:', event)
      setIsEditing(event)
      populateForm(event, true)
    } catch (error: any) {
      console.error('Error in handleEdit:', error)
      setError(`Failed to load event for editing: ${error.message}`)
    }
  }

  const handleCopy = (event: Event) => {
    try {
      console.log('Copying event:', event)
      setIsEditing(null) // Clear editing state so it creates a new event
      populateForm(event, false)
      setSuccess('Event data copied. Make your changes and click "Create Event" to save as a new event.')
      setTimeout(() => setSuccess(''), 5000)
    } catch (error: any) {
      console.error('Error in handleCopy:', error)
      setError(`Failed to copy event: ${error.message}`)
    }
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
          <div className="flex gap-4">
            <button
              onClick={() => {
                reset()
                setSelectedFlyerFile(null)
                setPreviewFlyerUrl('')
                setError('')
                setSuccess('')
                setIsEditing(null)
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
            >
              {isEditing ? 'Cancel Edit' : 'New Event'}
            </button>
            <Link
              href="/admin"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">
                {isEditing ? 'Edit Event' : 'Create New Event'}
              </h2>
              
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

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (Couple)
                    </label>
                    <input
                      {...register('priceCouple', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (Male)
                    </label>
                    <input
                      {...register('priceMale', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (Female)
                    </label>
                    <input
                      {...register('priceFemale', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Couples (Attendance)
                    </label>
                    <input
                      {...register('totalCouples', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Males (Attendance)
                    </label>
                    <input
                      {...register('totalMales', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Females (Attendance)
                    </label>
                    <input
                      {...register('totalFemales', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flyer Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFlyerFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    disabled={isLoading || uploadingFlyer}
                  />
                  {selectedFlyerFile && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">Selected: {selectedFlyerFile.name}</p>
                      {previewFlyerUrl && (
                        <img
                          src={previewFlyerUrl}
                          alt="Flyer preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
                        />
                      )}
                    </div>
                  )}
                  {uploadingFlyer && (
                    <p className="text-sm text-blue-600 mt-2">⏳ Uploading flyer image...</p>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
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
                    placeholder="https://example.com/image.jpg"
                    disabled={!!selectedFlyerFile || isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Or paste an image URL from Imgur, Cloudinary, etc.
                  </p>
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Existing Events</h2>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showPastEvents"
                  checked={showPastEvents}
                  onChange={(e) => setShowPastEvents(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="showPastEvents" className="text-sm font-medium text-gray-700">
                  Show Past Events
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Events
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, description, or theme..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {searchQuery && (
                <div className="mt-2 text-sm text-gray-600">
                  Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} matching "{searchQuery}"
                </div>
              )}
            </div>
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600">
                    {showPastEvents ? 'No events found.' : 'No upcoming events. Enable "Show Past Events" to see all events.'}
                  </p>
                </div>
              ) : (
                filteredEvents.map((event) => {
                  const isPast = isPastEvent(event.eventDate)
                  // Determine border color based on event status
                  let borderClass = ''
                  if (isPast) {
                    borderClass = 'opacity-75 border-l-4 border-red-400'
                  } else if (event.isActive) {
                    borderClass = 'border-l-4 border-green-400'
                  } else {
                    borderClass = 'border-l-4 border-yellow-400'
                  }
                  
                  // Calculate capacity percentage
                  const totalCouples = event.totalCouples || 0
                  const totalMales = event.totalMales || 0
                  const totalFemales = event.totalFemales || 0
                  const totalPeople = (totalCouples * 2) + totalMales + totalFemales
                  const capacity = 300
                  const capacityPercentage = Math.round((totalPeople / capacity) * 100)
                  
                  // Determine capacity tier and colors (4 tiers)
                  let capacityTier = ''
                  let capacityColor = 'text-gray-600'
                  let capacityBgColor = 'bg-gray-100'
                  let progressBarColor = 'bg-gray-400'
                  let shouldFlash = false
                  
                  if (capacityPercentage >= 76) {
                    // 76-100%: Excellent - Flashing Green
                    capacityTier = 'Excellent'
                    capacityColor = 'text-green-600'
                    capacityBgColor = 'bg-green-100'
                    progressBarColor = 'bg-green-500 animate-pulse'
                    shouldFlash = true
                  } else if (capacityPercentage >= 51) {
                    // 51-75%: Good - Yellow (no flash)
                    capacityTier = 'Good'
                    capacityColor = 'text-yellow-600'
                    capacityBgColor = 'bg-yellow-100'
                    progressBarColor = 'bg-yellow-500'
                    shouldFlash = false
                  } else if (capacityPercentage >= 26) {
                    // 26-50%: Poor - Flashing Orange
                    capacityTier = 'Poor'
                    capacityColor = 'text-orange-600'
                    capacityBgColor = 'bg-orange-100'
                    progressBarColor = 'bg-orange-500 animate-pulse'
                    shouldFlash = true
                  } else {
                    // 0-25%: Fail - Flashing Red
                    capacityTier = 'Fail'
                    capacityColor = 'text-red-600'
                    capacityBgColor = 'bg-red-100'
                    progressBarColor = 'bg-red-500 animate-pulse'
                    shouldFlash = true
                  }
                  
                  return (
                    <div 
                      key={event.id} 
                      className={`bg-white rounded-lg shadow p-6 ${borderClass}`}
                    >
                  <div className="flex justify-between items-start gap-4">
                    {/* Image thumbnail on the left */}
                    {event.flyerImage && (
                      <div className="flex-shrink-0">
                        <img
                          src={event.flyerImage}
                          alt={event.title}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                    {!event.flyerImage && (
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center">
                        <span className="text-gray-400 text-xs text-center px-2">No Image</span>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold">
                          {event.title}
                          {event.theme && (
                            <span className="text-gray-600 font-normal"> / {event.theme}</span>
                          )}
                        </h3>
                        {isPast && (
                          <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                            Past Event
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{event.description}</p>
                      <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <div className="flex flex-wrap gap-4 items-center">
                          <span className={isPast ? 'text-red-600 font-semibold' : ''}>
                            <strong>Date:</strong> {formatEventDate(event.eventDate)}
                            {isPast && ' (Past)'}
                          </span>
                          {(event.priceCouple || event.priceMale || event.priceFemale) && (
                            <span>
                              <strong>Prices:</strong>{' '}
                              {event.priceCouple && `Couple: $${event.priceCouple.toFixed(2)}`}
                              {event.priceCouple && (event.priceMale || event.priceFemale) && ', '}
                              {event.priceMale && `Male: $${event.priceMale.toFixed(2)}`}
                              {event.priceMale && event.priceFemale && ', '}
                              {event.priceFemale && `Female: $${event.priceFemale.toFixed(2)}`}
                            </span>
                          )}
                        </div>
                        <div>
                          <strong>Status:</strong>{' '}
                          <span className={event.isActive ? 'text-green-600' : 'text-yellow-600'}>
                            {event.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <span>
                            <strong>Attendance:</strong>{' '}
                            Couples: {event.totalCouples || 0}, 
                            Males: {event.totalMales || 0}, 
                            Females: {event.totalFemales || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleCopy(event)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
                        title="Copy this event to create a new one"
                      >
                        Copy
                      </button>
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
                  
                  {/* Capacity indicator */}
                  {totalPeople > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Capacity: {totalPeople} / {capacity} people ({capacityPercentage}%)
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${capacityBgColor} ${capacityColor} ${shouldFlash ? 'animate-pulse' : ''}`}>
                          {capacityTier}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all ${progressBarColor}`}
                          style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
