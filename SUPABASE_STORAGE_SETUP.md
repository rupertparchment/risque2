# Supabase Storage Setup for Image Uploads

## Step 1: Create Storage Bucket in Supabase

1. Go to **Supabase Dashboard** → Your Project
2. Click **"Storage"** in the left sidebar
3. Click **"New bucket"**
4. Configure:
   - **Name**: `gallery-images`
   - **Public bucket**: ✅ **Check this** (so images are publicly accessible)
   - **File size limit**: 5 MB (or your preference)
   - **Allowed MIME types**: `image/*` (or leave empty for all)
5. Click **"Create bucket"**

## Step 2: Set Up Bucket Policies (Make it Public)

1. In **Storage** → Click on `gallery-images` bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"**
4. Select **"For full customization"**
5. Create a policy for **SELECT** (read access):
   - **Policy name**: `Public read access`
   - **Allowed operation**: `SELECT`
   - **Policy definition**: 
     ```sql
     true
     ```
   - Click **"Review"** → **"Save policy"**

6. Create a policy for **INSERT** (upload access):
   - **Policy name**: `Authenticated upload`
   - **Allowed operation**: `INSERT`
   - **Policy definition**:
     ```sql
     true
     ```
   - Click **"Review"** → **"Save policy"**

**Note**: For admin-only uploads, you might want to restrict INSERT to authenticated users only. For now, `true` allows anyone to upload (you can restrict this later).

## Step 3: Get Supabase Credentials

1. Go to **Supabase Dashboard** → Your Project → **Settings** → **API**
2. Find:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 4: Add Environment Variables to Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add these two variables:

   **Variable 1:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase Project URL (from Step 3)
   - **Environments**: Production, Preview, Development

   **Variable 2:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon/public key (from Step 3)
   - **Environments**: Production, Preview, Development

3. Click **Save** for each

## Step 5: Redeploy

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment → **"Redeploy"**
3. Wait for deployment to finish

## Step 6: Test Image Upload

1. Go to `https://www.risque2.com/admin/gallery`
2. Click **"Choose File"** and select an image
3. Fill in the form (Title, Category, etc.)
4. Click **"Add Image"**
5. The image should upload and appear in your gallery!

## Troubleshooting

**Error: "Missing Supabase environment variables"**
- Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel
- Redeploy after adding them

**Error: "Upload failed: Bucket not found"**
- Make sure the bucket is named exactly `gallery-images` (case-sensitive)
- Check that the bucket exists in Supabase Storage

**Error: "Upload failed: new row violates row-level security policy"**
- Check that the bucket policies are set up correctly (Step 2)
- Make sure INSERT policy allows uploads

**Images not showing:**
- Make sure the bucket is set to **"Public"**
- Check that SELECT policy allows public read access

## Security Note

Currently, the upload endpoint allows anyone to upload. For production, you should:
1. Add authentication to the upload endpoint
2. Restrict INSERT policy to authenticated users only
3. Add file type/size validation (already done in code)
