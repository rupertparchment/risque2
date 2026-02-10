import { PrismaClient } from '@prisma/client'
import Image from 'next/image'

const prisma = new PrismaClient()

async function getGalleryImages() {
  const images = await prisma.galleryImage.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  })
  return images
}

export default async function GalleryPage() {
  const images = await getGalleryImages()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">Gallery</h1>
        <p className="text-gray-600 mb-8">
          Take a look at our modern, clean facilities.
        </p>

        {images.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Gallery images coming soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div key={image.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{image.title}</h3>
                  {image.description && (
                    <p className="text-gray-600 text-sm">{image.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
