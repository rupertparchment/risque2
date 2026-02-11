# Fix: Supabase Authentication Failed

## Possible Issues

1. **Wrong password** - The database password might be different
2. **Password encoding** - Some Supabase setups don't need URL encoding
3. **Username format** - Pooling might need different username format

## Step 1: Verify Database Password

1. Go to **Supabase Dashboard** → Your Project
2. Go to **Settings** → **Database**
3. Scroll to **"Database Password"** section
4. Check what the password actually is
5. If you're not sure, you can **reset** the password:
   - Click **"Reset Database Password"**
   - Copy the new password immediately (you won't see it again)
   - Use this new password in the connection string

## Step 2: Try Connection String WITHOUT URL Encoding

Sometimes Supabase connection strings work better without URL encoding. Try:

1. Get the connection string from Supabase (with `[YOUR-PASSWORD]` placeholder)
2. Replace `[YOUR-PASSWORD]` with the **actual password** (not URL-encoded):
   ```
   postgresql://postgres.spuwqyknbdyicicxfomd:Parchie!970#2026@aws-1-us-east-1.pooler.supabase.com:6543/postgres
   ```
3. Update in Vercel and test

## Step 3: Try Direct Connection (Not Pooling)

If pooling doesn't work, try the direct connection:

1. In Supabase → **Settings** → **Database**
2. Find **"Connection String"** (not Connection Pooling)
3. Copy the **URI** (should use port `5432`)
4. Replace `[YOUR-PASSWORD]` with your password (try both encoded and non-encoded)
5. Update in Vercel

## Step 4: Reset Database Password (If Needed)

If you're not sure about the password:

1. Go to **Supabase Dashboard** → **Settings** → **Database**
2. Click **"Reset Database Password"**
3. **Copy the new password immediately** (save it somewhere safe)
4. Use this new password in your connection string
5. Update in Vercel

## Connection String Formats to Try

### Format 1: Transaction Pooling (Current)
```
postgresql://postgres.spuwqyknbdyicicxfomd:Parchie!970#2026@aws-1-us-east-1.pooler.supabase.com:6543/postgres
```
(No URL encoding)

### Format 2: Transaction Pooling (URL-encoded)
```
postgresql://postgres.spuwqyknbdyicicxfomd:Parchie%21%23970%232026@aws-1-us-east-1.pooler.supabase.com:6543/postgres
```
(With URL encoding)

### Format 3: Direct Connection
```
postgresql://postgres:Parchie!970#2026@db.spuwqyknbdyicicxfomd.supabase.co:5432/postgres
```
(Direct, no pooling, port 5432)
