# Vercel Blob Storage Setup

## What is Vercel Blob?

Vercel Blob is a serverless storage solution that's perfect for hosting images and files. It's:
- ✅ Built into Vercel (no external setup needed)
- ✅ Supports large files (up to 5TB)
- ✅ Edge-delivered for fast performance
- ✅ Secure and automatically optimized

## Setup Steps

### Step 1: Enable Vercel Blob (Automatic)

Vercel Blob is automatically available in your Vercel project. No additional setup needed!

### Step 2: Get Your Blob Store Token

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Storage**
2. Click **"Create Database"** or **"Add Storage"**
3. Select **"Blob"**
4. Click **"Create"**
5. This will automatically add the `BLOB_READ_WRITE_TOKEN` environment variable

**OR** if you already have Blob storage:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Storage**
2. Find your Blob store
3. The token is automatically available to your serverless functions

### Step 3: Verify Environment Variable

The `BLOB_READ_WRITE_TOKEN` should be automatically set by Vercel. You can verify:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Look for `BLOB_READ_WRITE_TOKEN` (it might not be visible, but it's available to functions)

### Step 4: Deploy

That's it! The code is already set up. Just deploy:

1. The code will automatically use Vercel Blob
2. Images will be uploaded to your Blob store
3. Public URLs will be generated automatically

## How It Works

1. **User selects image** → File is chosen in the browser
2. **Form submission** → File is sent to `/api/admin/upload`
3. **Vercel Blob upload** → File is uploaded to Vercel Blob storage
4. **Public URL returned** → URL is saved to database
5. **Image displayed** → Image is served from Vercel's edge network

## Benefits

- **No external services** - Everything is in Vercel
- **Fast uploads** - Direct to Vercel's infrastructure
- **Edge delivery** - Images served from CDN
- **Automatic optimization** - Vercel handles image optimization
- **Large file support** - Up to 5TB per file
- **Secure** - Built-in security and access control

## File Limits

- **Max file size**: 10MB (configurable, can go up to 5TB)
- **Supported formats**: All image formats (JPEG, PNG, GIF, WebP, etc.)
- **Storage**: Unlimited (within your Vercel plan limits)

## Troubleshooting

**Error: "BLOB_READ_WRITE_TOKEN is not defined"**
- Make sure Blob storage is enabled in your Vercel project
- Go to Settings → Storage → Create Blob store if needed
- Redeploy after creating the store

**Error: "Upload failed"**
- Check file size (must be under 10MB by default)
- Verify file is an image (image/* MIME type)
- Check Vercel function logs for detailed error messages

**Images not showing:**
- Verify the URL is being saved correctly in the database
- Check that the blob URL is accessible (should be public)
- Check browser console for any CORS or loading errors

## Cost

Vercel Blob pricing:
- **Free tier**: 1GB storage, 1GB bandwidth/month
- **Pro tier**: $0.15/GB storage, $0.40/GB bandwidth
- Check [Vercel Pricing](https://vercel.com/pricing) for current rates

## That's It!

No complex setup needed - Vercel Blob works automatically once your project is deployed. Just make sure Blob storage is enabled in your Vercel project settings!
