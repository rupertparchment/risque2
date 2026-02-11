# Fix: Authentication Failed with Supabase

## The Problem
The connection is working, but the credentials are wrong. This could be:
1. Wrong password encoding
2. Wrong username format for pooling
3. Wrong connection string format

## Solution: Get Exact Connection String from Supabase

### Step 1: Get Connection String from Supabase Dashboard

1. Go to **Supabase Dashboard** → Your Project
2. Go to **Settings** → **Database**
3. Scroll to **"Connection Pooling"** section
4. Make sure **"Transaction"** mode is selected (not Session)
5. Find **"Connection String"** → Click **"URI"** tab
6. Copy the **entire connection string** (it should look like):
   ```
   postgresql://postgres.spuwqyknbdyicicxfomd:[YOUR-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres
   ```

### Step 2: Replace Password in Connection String

The connection string from Supabase will have `[YOUR-PASSWORD]` placeholder.

Replace `[YOUR-PASSWORD]` with your **URL-encoded** password:
- Your password: `Parchie!970#2026`
- URL-encoded: `Parchie%21%23970%232026`
  - `!` = `%21`
  - `#` = `%23`

So the full connection string should be:
```
postgresql://postgres.spuwqyknbdyicicxfomd:Parchie%21%23970%232026@aws-1-us-east-1.pooler.supabase.com:6543/postgres
```

### Step 3: Update in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find `DATABASE_URL` and click **Edit**
3. Paste the connection string from Step 2
4. Make sure it's checked for **Production**, **Preview**, and **Development**
5. Click **Save**
6. **Redeploy**

## Alternative: Check Password

If you're not sure about the password encoding:

1. Go to **Supabase Dashboard** → **Settings** → **Database**
2. Check what the actual database password is
3. Make sure you're using the correct password
4. URL-encode any special characters (`!` = `%21`, `#` = `%23`)

## Still Not Working?

Try the **Session** pooling mode instead:

1. In Supabase → **Settings** → **Database** → **Connection Pooling**
2. Switch to **"Session"** mode
3. Copy the connection string (will use port `5432` instead of `6543`)
4. Replace `[YOUR-PASSWORD]` with URL-encoded password
5. Update in Vercel
