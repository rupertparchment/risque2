# Get Vercel Blob Token

## Step 1: Get the Token from Vercel

1. Go to **Vercel Dashboard** → Your Project (`risque2`)
2. Go to **Settings** → **Storage**
3. Find your Blob store: `risque2-blob`
4. Click on it to open the details
5. Look for **"Token"** or **"Read/Write Token"**
6. **Copy the token** (it should start with `vercel_blob_`)

**OR** if you don't see the token there:

1. Go to **Vercel Dashboard** → **Settings** (top right, your account settings)
2. Go to **Tokens** or **Storage**
3. Find tokens related to Blob storage
4. Copy the token

## Step 2: Add Token to Environment Variables

1. Go back to **Vercel Dashboard** → Your Project (`risque2`)
2. Go to **Settings** → **Environment Variables**
3. Click **"Add New"**
4. Enter:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Paste the token you copied
   - **Environments**: Check **Production**, **Preview**, and **Development**
5. Click **Save**

## Step 3: Redeploy

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment → **"Redeploy"**
3. Wait for deployment to finish

## Alternative: Use Vercel CLI

If you can't find the token in the dashboard, you can also:

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel blob token`
3. Copy the token and add it to environment variables

## After Adding Token

Once you've added `BLOB_READ_WRITE_TOKEN` and redeployed, try uploading an image again. It should work!
