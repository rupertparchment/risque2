# Database URL Fix

## Problem
The password contains special characters (`!` and `#`) that need to be URL-encoded in the connection string.

## Solution

### Original (doesn't work):
```
postgresql://postgres:Parchie!970#2026@db.spuwqyknbdyicicxfomd.supabase.co:5432/postgres
```

### Fixed (URL-encoded):
```
postgresql://postgres:Parchie%21%23970%232026@db.spuwqyknbdyicicxfomd.supabase.co:5432/postgres
```

### Character Encoding:
- `!` → `%21`
- `#` → `%23`

## Steps to Fix in Vercel:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find `DATABASE_URL` and click **Edit** (or delete and recreate)
3. Replace the value with the URL-encoded version above
4. Make sure it's set for **Production, Preview, and Development**
5. Click **Save**
6. **Redeploy**: Go to **Deployments** → Click **"..."** on latest → **"Redeploy"**

## Alternative: Get Connection String from Supabase

If URL encoding is confusing, you can get a properly formatted connection string from Supabase:

1. Go to your Supabase project dashboard
2. Go to **Settings** → **Database**
3. Find **Connection string** section
4. Copy the **URI** (it should already be properly encoded)
5. Use that value in Vercel instead
