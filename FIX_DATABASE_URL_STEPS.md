# Step-by-Step Fix for DATABASE_URL Error

## The Error
```
Invalid `prisma.galleryImage.create()` invocation: error: Error validating datasource `db`: 
the URL must start with the protocol `postgresql://` or `postgres://`.
```

This means `DATABASE_URL` is either:
- Not set
- Empty
- Has extra characters/spaces
- Has quotes around it
- Not available at runtime

## Fix Steps

### Step 1: Delete and Recreate the Variable

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find `DATABASE_URL`
3. Click **Delete** (trash icon)
4. Confirm deletion

### Step 2: Add It Fresh

1. Click **"Add New"** button
2. **Name**: Type exactly `DATABASE_URL` (case-sensitive, no spaces)
3. **Value**: Copy this EXACT string (no quotes, no spaces before/after):
   ```
   postgresql://postgres.spuwqyknbdyicicxfomd:Parchie%21%23970%232026@aws-1-us-east-1.pooler.supabase.com:6543/postgres
   ```
4. **Environments**: Check ALL THREE:
   - ☑ Production
   - ☑ Preview  
   - ☑ Development
5. Click **Save**

### Step 3: Create Fresh Deployment

**IMPORTANT**: After adding/updating env vars, you MUST create a new deployment:

1. Go to **Deployments** tab
2. Click **"Deploy"** button (top right, blue button)
3. Select **"Deploy Latest Commit"**
4. Wait for it to finish (1-2 minutes)

**DO NOT** just click "Redeploy" - create a fresh deployment.

### Step 4: Verify It Worked

After deployment completes:

1. Go to **Deployments** → Click the new deployment
2. Go to **"Functions"** tab
3. Find `/api/admin/gallery` and click it
4. Try adding an image on the website
5. Come back to the Functions tab and check **"Logs"**

You should see logs showing the request, and hopefully no DATABASE_URL errors.

## Alternative: Use Direct Connection (If Pooling Doesn't Work)

If transaction pooling still doesn't work, try the direct connection:

1. Go to Supabase Dashboard → Settings → Database
2. Find **"Connection string"** (not Connection Pooling)
3. Copy the **URI** (it should look like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.spuwqyknbdyicicxfomd.supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your password (URL-encoded: `Parchie%21%23970%232026`)
5. Full string:
   ```
   postgresql://postgres:Parchie%21%23970%232026@db.spuwqyknbdyicicxfomd.supabase.co:5432/postgres
   ```
6. Use this in Vercel instead

## Common Mistakes to Avoid

❌ **Don't** add quotes: `"postgresql://..."`
❌ **Don't** add spaces before/after the value
❌ **Don't** use wrong case: `database_url` or `Database_Url`
❌ **Don't** only set for Preview, forget Production
❌ **Don't** just redeploy - create a fresh deployment after adding env vars

## Still Not Working?

If it still fails after all this:

1. Check Supabase → Settings → Database → Connection Pooling
   - Make sure it's enabled
   - Try copying the connection string again

2. Try the direct connection URL instead of pooling

3. Check Vercel build logs for any warnings about environment variables
