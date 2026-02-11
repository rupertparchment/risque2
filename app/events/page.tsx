import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

// Helper to parse date string as local date (avoid timezone issues)
function parseLocalDate(dateString: string): Date {
  // If dateString is in YYYY-MM-DD format, parse it as local date
  if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
    const [year, month, day] = dateString.split('T')[0].split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  // Otherwise, parse normally
  return new Date(dateString)
}

// Helper to format date consistently
function formatEventDate(dateString: string): string {
  const date = parseLocalDate(dateString)
  return format(date, 'EEEE, MMM d, yyyy')
}

// Make this page dynamic (fetch at runtime, not build time)
export const dynamic = 'force-dynamic'

async function getEvents() {
  try {
    // Get today's date at midnight (start of day) for comparison
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const events = await prisma.event.findMany({
      where: { 
        isActive: true,
        eventDate: {
          gte: today, // Only events on or after today
        },
      },
      orderBy: { eventDate: 'asc' },
    })
    return events
  } catch (error) {
    // Database not set up yet or tables don't exist
    console.error('Error fetching events:', error)
    return []
  }
}

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">Upcoming Events</h1>
        <p className="text-gray-600 mb-8">
          Join us for our exciting events. Members receive priority access.
        </p>

        {events.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No upcoming events scheduled. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {event.flyerImage && (
                  <div className="relative h-64 w-full">
                    <Image
                      src={event.flyerImage}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">
                    {event.title}
                    {event.theme && (
                      <span className="text-gray-600 font-normal"> / {event.theme}</span>
                    )}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-700">
                      <span className="font-semibold mr-2">Date:</span>
                      {formatEventDate(event.eventDate.toString())}
                    </div>
                    {(event.priceCouple || event.priceMale || event.priceFemale) && (
                      <div className="flex items-center text-gray-700">
                        <span className="font-semibold mr-2">Prices:</span>
                        <span>
                          {event.priceCouple && `Couple: $${event.priceCouple.toFixed(2)}`}
                          {event.priceCouple && (event.priceMale || event.priceFemale) && ', '}
                          {event.priceMale && `Male: $${event.priceMale.toFixed(2)}`}
                          {event.priceMale && event.priceFemale && ', '}
                          {event.priceFemale && `Female: $${event.priceFemale.toFixed(2)}`}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/events/${event.id}`}
                    className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center px-4 py-2 rounded-lg transition-colors"
                  >
                    View Details & RSVP
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
