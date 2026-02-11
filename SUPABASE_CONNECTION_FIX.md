# Fix: Can't Reach Database Server

## The Problem
Vercel can't connect to Supabase using the direct connection URL. This is common with serverless functions.

## Solution: Use Transaction Pooling URL

The direct connection (`:5432`) doesn't work well with Vercel's serverless functions. Use the **Transaction Pooling** connection instead.

## Steps to Fix

1. Go to **Vercel Dashboard** → Your Project (`risque2` or `risque2-sbv2` - whichever is active)
2. Go to **Settings** → **Environment Variables**
3. Find `DATABASE_URL` and click **Edit**
4. Replace the value with the **Transaction Pooling** URL:
   ```
   postgresql://postgres.spuwqyknbdyicicxfomd:Parchie%21%23970%232026@aws-1-us-east-1.pooler.supabase.com:6543/postgres
   ```
5. Make sure it's checked for **Production**, **Preview**, and **Development**
6. Click **Save**
7. **Redeploy**: Go to **Deployments** → Click **"..."** on latest → **"Redeploy"**

## Why Transaction Pooling?

- ✅ Works better with serverless functions (Vercel)
- ✅ Handles connection pooling automatically
- ✅ More reliable for short-lived connections
- ✅ Port `6543` instead of `5432` (pooler port)

## Alternative: Check Supabase Settings

If pooling still doesn't work:

1. Go to **Supabase Dashboard** → Your Project
2. Go to **Settings** → **Database**
3. Check **Connection Pooling** is enabled
4. Make sure **"Transaction"** mode is selected (not Session)
5. Copy the connection string again from there

## Still Not Working?

If you still get connection errors:

1. Check Supabase → **Settings** → **Database** → **Connection Pooling**
   - Make sure it's enabled
   - Check if there are any IP restrictions

2. Try the **Session** pooling URL instead (if Transaction doesn't work):
   - Port `6543` for Transaction (recommended)
   - Port `5432` for Session (fallback)

3. Check Supabase logs for connection attempts
