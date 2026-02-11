# Fix: Prepared Statement Already Exists Error

## The Problem
Supabase's transaction pooling (port 6543) doesn't support prepared statements, which Prisma uses by default. This causes the "prepared statement already exists" error.

## Solution
Add `?pgbouncer=true` to your DATABASE_URL connection string to disable prepared statements.

## Steps to Fix

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find `DATABASE_URL` and click **Edit**
3. Add `?pgbouncer=true` to the end of your connection string:

   **Current:**
   ```
   postgresql://postgres.spuwqyknbdyicicxfomd:Parchie%21%23970%232026@aws-1-us-east-1.pooler.supabase.com:6543/postgres
   ```

   **Updated:**
   ```
   postgresql://postgres.spuwqyknbdyicicxfomd:Parchie%21%23970%232026@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

4. Make sure it's checked for **Production**, **Preview**, and **Development**
5. Click **Save**
6. **Redeploy**: Go to **Deployments** → Click **"..."** on latest → **"Redeploy"**

## Important Notes

- **Must include `pgbouncer=true`**: This tells Prisma to disable prepared statements, which are incompatible with Supabase's transaction pooling
- **If error persists**: You may need to restart your Supabase project, or wait a few minutes for connections to clear
- **Alternative**: If you need prepared statements, use the direct connection (port 5432) instead, but you'll lose connection pooling benefits

## After Fixing

Once you've updated the connection string and redeployed, try uploading an image again. The error should be resolved!
