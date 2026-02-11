import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB for Vercel Blob)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExt = file.name.split('.').pop()
    const fileName = `gallery/${timestamp}-${randomString}.${fileExt}`

    // Upload to Vercel Blob
    // Try to get token from environment, or use store ID
    const token = process.env.BLOB_READ_WRITE_TOKEN
    const storeId = process.env.BLOB_STORE_ID || 'store_bCvwHAkdvWCZNQWz' // Fallback to your store ID
    
    const blob = await put(fileName, file, {
      access: 'public',
      contentType: file.type,
      token: token, // Explicitly pass token if available
    })

    return NextResponse.json({
      url: blob.url,
      fileName: fileName,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    )
  }
}
