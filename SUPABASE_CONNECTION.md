# Supabase Connection Setup

## Your Supabase Project
- **Name:** risque2
- **Connection String Template:** `postgresql://postgres:[YOUR-PASSWORD]@db.spuwqyknbdyicicxfomd.supabase.co:5432/postgres`

## Next Steps

### Step 1: Get Your Actual Password

**You set a password when creating the Supabase project.**
- This is the password you entered when creating the project
- If you forgot it, you can reset it in Supabase settings

### Step 2: Create Full Connection String

**Replace `[YOUR-PASSWORD]` with your actual password:**

Example:
```
postgresql://postgres:MySecurePassword123@db.spuwqyknbdyicicxfomd.supabase.co:5432/postgres
```

**Important:** 
- No brackets `[]` in the final string
- Use your actual password
- Keep the rest exactly as shown

### Step 3: Update Vercel Environment Variable

1. **Go to Vercel Dashboard**
2. **Your Project → Settings → Environment Variables**
3. **Find `DATABASE_URL`**
4. **Click "Edit" or the pencil icon**
5. **Replace the value with your full connection string:**
   ```
   postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.spuwqyknbdyicicxfomd.supabase.co:5432/postgres
   ```
6. **Click "Save"**

### Step 4: Push Schema Changes

**The schema is already updated to PostgreSQL. Push it:**

```bash
cd ~/OneDrive/Tabu/risque-website
git add prisma/schema.prisma
git commit -m "Update to PostgreSQL for production"
git push
```

### Step 5: Run Database Migrations

**After Vercel redeploys, we need to create the database tables.**

**Option A: Via Supabase SQL Editor (Easiest)**

1. **Go to Supabase Dashboard**
2. **Click "SQL Editor"** (left sidebar)
3. **Click "New query"**
4. **Paste this SQL:**

```sql
-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP,
    "membershipStatus" TEXT NOT NULL DEFAULT 'pending',
    "membershipStart" TIMESTAMP,
    "membershipEnd" TIMESTAMP,
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- Create Event table
CREATE TABLE IF NOT EXISTS "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventDate" TIMESTAMP NOT NULL,
    "eventTime" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "theme" TEXT,
    "flyerImage" TEXT,
    "interiorImage" TEXT,
    "capacity" INTEGER NOT NULL DEFAULT 150,
    "price" REAL NOT NULL DEFAULT 100.00,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- Create Payment table
CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "paymentType" TEXT NOT NULL,
    "eventId" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create RSVP table
CREATE TABLE IF NOT EXISTS "RSVP" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "guests" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE("userId", "eventId")
);

-- Create GalleryImage table
CREATE TABLE IF NOT EXISTS "GalleryImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'interior',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "Payment_userId_idx" ON "Payment"("userId");
CREATE INDEX IF NOT EXISTS "Payment_eventId_idx" ON "Payment"("eventId");
CREATE INDEX IF NOT EXISTS "RSVP_userId_idx" ON "RSVP"("userId");
CREATE INDEX IF NOT EXISTS "RSVP_eventId_idx" ON "RSVP"("eventId");
```

5. **Click "Run"** (or press Ctrl+Enter)
6. **You should see "Success. No rows returned"**

**Option B: Use Prisma Migrate (If you have local setup)**

```bash
npx prisma migrate deploy
```

### Step 6: Verify It Works

**After migrations:**
1. Visit your Vercel website
2. Go to `/events` - should load without errors
3. Go to `/gallery` - should load without errors
4. Go to `/admin` - should work

## Quick Checklist

- [ ] Got your Supabase password
- [ ] Created full connection string (no brackets)
- [ ] Updated DATABASE_URL in Vercel
- [ ] Pushed schema changes to GitHub
- [ ] Ran database migrations (SQL Editor)
- [ ] Tested website

## Need Help?

If you need help with any step, let me know!
