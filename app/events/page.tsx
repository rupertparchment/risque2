import { PrismaClient, Event } from '@prisma/client'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

const prisma = new PrismaClient()

async function getEvents(): Promise<Event[]> {
  const events = await prisma.event.findMany({
    where: { isActive: true },
    orderBy: { eventDate: 'asc' },
  })
  return events
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
            {events.map((event: Event) => (
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
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold">{event.title}</h2>
                    {event.theme && (
                      <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded">
                        {event.theme}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-700">
                      <span className="font-semibold mr-2">Date:</span>
                      {format(new Date(event.eventDate), 'MMMM d, yyyy')}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="font-semibold mr-2">Time:</span>
                      {event.eventTime}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="font-semibold mr-2">Price:</span>
                      ${event.price.toFixed(2)} per couple
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="font-semibold mr-2">Capacity:</span>
                      {event.capacity} people
                    </div>
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
