'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface GalleryImage {
  id: string
  title: string
  description?: string
  imageUrl: string
  category: string
  isActive: boolean
  displayOrder: number
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isEditing, setIsEditing] = useState<GalleryImage | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [uploadingFile, setUploadingFile] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setError('')
      const response = await fetch('/api/admin/gallery')
      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }
      const data = await response.json()
      setImages(data || [])
    } catch (error) {
      console.error('Failed to fetch gallery images:', error)
      setError('Failed to load gallery images. Please refresh the page.')
      setImages([])
    }
  }

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<GalleryImage>({
    mode: 'onChange',
  })
  
  const onError = (errors: any) => {
    console.error('Form validation errors:', errors)
    setError('Please fill in all required fields correctly.')
  }

  const onSubmit = async (data: any) => {
    console.log('Form submitted!', data)
    
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      let imageUrl = ''

      // Upload file if selected
      if (selectedFile) {
        setUploadingFile(true)
        try {
          imageUrl = await handleUpload(selectedFile)
          console.log('File uploaded:', imageUrl)
        } catch (uploadError: any) {
          setError(`Upload failed: ${uploadError.message}`)
          setIsLoading(false)
          setUploadingFile(false)
          return
        } finally {
          setUploadingFile(false)
        }
      } else if (data.imageUrl?.trim()) {
        // Use URL if provided
        imageUrl = data.imageUrl.trim()
        
        // Convert Imgur album/page URLs to direct image URLs
        if (imageUrl.includes('imgur.com/') && !imageUrl.includes('i.imgur.com')) {
          const imgurId = imageUrl.split('imgur.com/')[1]?.split('/')[0]?.split('?')[0]
          if (imgurId) {
            imageUrl = `https://i.imgur.com/${imgurId}.jpg`
            console.log('Converted Imgur URL:', data.imageUrl, '→', imageUrl)
          }
        }
      } else {
        setError('Please either upload an image or provide an image URL')
        setIsLoading(false)
        return
      }

      const url = isEditing
        ? `/api/admin/gallery/${isEditing.id}`
        : '/api/admin/gallery'
      const method = isEditing ? 'PUT' : 'POST'

      // Ensure checkbox value is boolean
      const submitData = {
        title: data.title,
        description: data.description || null,
        imageUrl: imageUrl,
        category: data.category || 'interior',
        displayOrder: data.displayOrder ? parseInt(String(data.displayOrder)) : 0,
        isActive: data.isActive === true || data.isActive === 'on' || data.isActive === undefined,
      }

      console.log('Submitting:', { url, method, submitData })

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()
      console.log('Response:', { status: response.status, result })

      if (response.ok) {
        setSuccess(isEditing ? 'Image updated successfully!' : 'Image added successfully!')
        fetchImages()
        reset()
        setSelectedFile(null)
        setPreviewUrl('')
        setIsEditing(null)
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error || `Failed to save image. Status: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to save gallery image:', error)
      setError('Failed to save image. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setValue('imageUrl', '') // Clear URL field when file is selected
      setError('')
    }
  }

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

  const handleEdit = (image: GalleryImage) => {
    setIsEditing(image)
    setSelectedFile(null)
    setPreviewUrl('')
    setValue('title', image.title)
    setValue('description', image.description || '')
    setValue('imageUrl', image.imageUrl)
    setValue('category', image.category)
    setValue('displayOrder', image.displayOrder)
    setValue('isActive', image.isActive)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchImages()
      }
    } catch (error) {
      console.error('Failed to delete image:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Manage Gallery</h1>
            <p className="text-gray-600 mt-2">Upload and manage interior photos</p>
          </div>
          <div className="flex gap-4">
            <a
              href="/admin"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Back to Dashboard
            </a>
            <button
              onClick={() => {
                reset()
                setSelectedFile(null)
                setPreviewUrl('')
                setIsEditing(null)
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
            >
              {isEditing ? 'Cancel Edit' : 'New Image'}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">
                {isEditing ? 'Edit Image' : 'Add New Image'}
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
              
              {isLoading && (
                <div className="bg-blue-50 border-2 border-blue-500 text-blue-700 px-4 py-3 rounded mb-4 font-semibold">
                  ⏳ Saving image, please wait...
                </div>
              )}
              
              <form 
                onSubmit={handleSubmit(onSubmit, onError)} 
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Main Lounge"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Optional description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    disabled={isLoading || uploadingFile}
                  />
                  {selectedFile && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">Selected: {selectedFile.name}</p>
                      {previewUrl && (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
                        />
                      )}
                    </div>
                  )}
                  {uploadingFile && (
                    <p className="text-sm text-blue-600 mt-2">⏳ Uploading image...</p>
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
                    Image URL
                  </label>
                  <input
                    {...register('imageUrl', { 
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'Please enter a valid URL starting with http:// or https://'
                      },
                      validate: (value) => {
                        if (!selectedFile && !value?.trim()) {
                          return 'Please either upload an image or provide an image URL'
                        }
                        return true
                      }
                    })}
                    type="url"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://example.com/image.jpg"
                    disabled={!!selectedFile || isLoading}
                  />
                  {errors.imageUrl && (
                    <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Or paste an image URL from Imgur, Cloudinary, etc.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category', { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="interior">Interior</option>
                    <option value="facility">Facility</option>
                    <option value="rooms">Rooms</option>
                    <option value="bar">Bar</option>
                    <option value="lounge">Lounge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    {...register('displayOrder', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    defaultValue={0}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lower numbers appear first (0 = first)
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    {...register('isActive')}
                    type="checkbox"
                    id="isActive"
                    className="mr-2"
                    defaultChecked
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active (visible on website)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '⏳ Saving...' : isEditing ? 'Update Image' : 'Add Image'}
                </button>
                
                {isLoading && (
                  <div className="mt-2 text-sm text-gray-600 text-center">
                    Please wait while we save your image...
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Gallery Images</h2>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {images.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No images yet. Add your first image!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {images
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((image) => (
                    <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="relative h-48 w-full bg-gray-200">
                        {image.imageUrl ? (
                          <img
                            src={image.imageUrl}
                            alt={image.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23ddd" width="400" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E'
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold">{image.title}</h3>
                        {image.description && (
                          <p className="text-gray-600 text-sm mt-1">{image.description}</p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {image.category}
                          </span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            Order: {image.displayOrder}
                          </span>
                          <span
                            className={
                              image.isActive
                                ? 'bg-green-100 text-green-800 px-2 py-1 rounded'
                                : 'bg-red-100 text-red-800 px-2 py-1 rounded'
                            }
                          >
                            {image.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handleEdit(image)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(image.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
