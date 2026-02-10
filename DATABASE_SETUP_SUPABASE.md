# Set Up PostgreSQL Database with Supabase

## Why Supabase?

- ✅ **FREE** tier available
- ✅ Easy to set up
- ✅ Perfect for your needs
- ✅ Includes PostgreSQL database

## Step-by-Step Setup

### Step 1: Create Supabase Account

1. **Go to:** https://supabase.com
2. **Click "Start your project"** or **"Sign Up"**
3. **Sign up** (can use GitHub, Google, or email)
4. **Verify email** if needed

### Step 2: Create New Project

1. **Click "New Project"**
2. **Fill in details:**
   - **Name:** `risque-club` (or any name)
   - **Database Password:** Choose a strong password (save this!)
   - **Region:** Choose closest to you (US East/West)
   - **Pricing Plan:** Free (should be selected by default)
3. **Click "Create new project"**
4. **Wait 2-3 minutes** for project to be created

### Step 3: Get Connection String

1. **Once project is ready, click on your project**
2. **Go to:** Settings (gear icon) → **Database**
3. **Scroll down to "Connection string"**
4. **Click "URI" tab**
5. **Copy the connection string**

**It will look like:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

**Replace `[YOUR-PASSWORD]` with the password you set when creating the project**

### Step 4: Update Vercel Environment Variable

1. **Go to Vercel Dashboard**
2. **Your Project → Settings → Environment Variables**
3. **Find `DATABASE_URL`**
4. **Click "Edit"**
5. **Replace value with your Supabase connection string:**
   ```
   postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```
6. **Click "Save"**

### Step 5: Update Prisma Schema

**We need to change from SQLite to PostgreSQL:**

1. **In your local code, edit `prisma/schema.prisma`**
2. **Change this:**
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
   
   **To this:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Save the file**

### Step 6: Push Updated Schema

**In Git Bash:**

```bash
cd ~/OneDrive/Tabu/risque-website
git add prisma/schema.prisma
git commit -m "Update Prisma schema to use PostgreSQL"
git push
```

### Step 7: Run Database Migrations

**After Vercel redeploys, you need to run migrations:**

**Option A: Run via Vercel (Easier)**
1. In Vercel, go to your project
2. Go to "Deployments" tab
3. Click on latest deployment
4. Go to "Functions" tab
5. Or use Vercel CLI (if you have it installed)

**Option B: Run Locally (If you have Node.js)**
```bash
cd ~/OneDrive/Tabu/risque-website
npx prisma migrate deploy
```

**Option C: Use Supabase SQL Editor**
1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Run the migration SQL manually (I can help generate this)

### Step 8: Verify Database is Working

**After migrations run:**
1. Visit your website
2. Go to `/events` - should load (even if empty)
3. Go to `/gallery` - should load (even if empty)
4. Go to `/admin` - should work

## Quick Checklist

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Got connection string
- [ ] Updated DATABASE_URL in Vercel
- [ ] Updated prisma/schema.prisma to PostgreSQL
- [ ] Pushed schema changes to GitHub
- [ ] Ran database migrations
- [ ] Tested website

## Troubleshooting

**"Connection refused"**
- Check connection string is correct
- Make sure password is correct (no brackets)
- Check Supabase project is active

**"Table does not exist"**
- Need to run migrations
- See Step 7 above

**"Invalid connection string"**
- Make sure you replaced `[YOUR-PASSWORD]` with actual password
- Check for any extra spaces

## Need Help?

If you get stuck on any step, let me know! The database setup is critical for your website to work properly.
