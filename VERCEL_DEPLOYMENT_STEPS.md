# Deploy to Vercel - Step by Step

## Step 1: Sign Up/Login to Vercel

1. **Go to:** https://vercel.com
2. **Click "Sign Up"** (or "Log In" if you have an account)
3. **Choose "Continue with GitHub"**
4. **Authorize Vercel** to access your GitHub account

## Step 2: Import Your Project

1. **Click "Add New..."** → **"Project"**
2. **Find your repository:** `rupertparchment/risque2`
3. **Click "Import"**

## Step 3: Configure Project

**Vercel should auto-detect:**
- Framework: **Next.js** ✅
- Root Directory: `./` ✅
- Build Command: `npm run build` ✅
- Output Directory: `.next` ✅

**Leave these as default!**

## Step 4: Add Environment Variables

**Before clicking "Deploy", click "Environment Variables"**

**Add these one by one:**

### 1. DATABASE_URL
**For now (development):**
```
DATABASE_URL=file:./dev.db
```

**Later (production), you'll need PostgreSQL:**
- Sign up for Supabase (free): https://supabase.com
- Create project
- Get connection string
- Update this variable

### 2. NEXTAUTH_URL
```
NEXTAUTH_URL=https://risque2.com
```

### 3. NEXTAUTH_SECRET
**Generate a secret:**
- Go to: https://generate-secret.vercel.app/32
- Or run: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- Copy the generated string

**Add:**
```
NEXTAUTH_SECRET=paste-your-generated-secret-here
```

### 4. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
**Get from Stripe:**
- Go to: https://dashboard.stripe.com/test/apikeys
- Copy "Publishable key" (starts with `pk_test_`)

**Add:**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 5. STRIPE_SECRET_KEY
**Get from Stripe:**
- Same page as above
- Copy "Secret key" (starts with `sk_test_`)
- Click "Reveal test key" if needed

**Add:**
```
STRIPE_SECRET_KEY=sk_test_...
```

### 6. STRIPE_WEBHOOK_SECRET
**We'll set this up after deployment:**
- Leave blank for now
- We'll add it after connecting domain

### 7. ADMIN_EMAIL
```
ADMIN_EMAIL=admin@risque2.com
```

### 8. ADMIN_PASSWORD
```
ADMIN_PASSWORD=your-secure-password-here
```
**Choose a strong password!**

## Step 5: Deploy!

1. **Click "Deploy"**
2. **Wait 2-3 minutes** for build to complete
3. **You'll get a URL like:** `risque2-abc123.vercel.app`

## Step 6: Connect Your Domain

1. **In Vercel Dashboard:**
   - Go to your project
   - Click **"Settings"** → **"Domains"**
   - Click **"Add Domain"**
   - Enter: `risque2.com`
   - Click **"Add"**
   - Also add: `www.risque2.com`

2. **Vercel will show DNS instructions:**
   - You'll see something like:
     - A record: `@` → `76.76.21.21`
     - CNAME: `www` → `cname.vercel-dns.com`

3. **Update DNS in Bluehost:**
   - Log into Bluehost cPanel
   - Go to "DNS Zone Editor"
   - Remove existing A record for `@`
   - Add new A record: `@` → IP from Vercel
   - Add CNAME: `www` → CNAME from Vercel
   - Save

4. **Wait for DNS (1-2 hours usually)**

## Step 7: Set Up Stripe Webhook (After Domain is Connected)

1. **In Stripe Dashboard:**
   - Go to: Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://risque2.com/api/webhooks/stripe`
   - Select event: `checkout.session.completed`
   - Click "Add endpoint"
   - Copy the "Signing secret" (starts with `whsec_`)

2. **In Vercel:**
   - Go to Project Settings → Environment Variables
   - Add/Update: `STRIPE_WEBHOOK_SECRET` = your signing secret
   - Redeploy (or it will auto-update)

## Step 8: Set Up Database (Important!)

**SQLite won't work on Vercel. You need PostgreSQL:**

### Option A: Supabase (Free - Recommended)

1. **Sign up:** https://supabase.com
2. **Create new project**
3. **Get connection string:**
   - Project Settings → Database
   - Copy "Connection string" (URI format)
   - Looks like: `postgresql://postgres:[password]@[host]:5432/postgres`

4. **Update Prisma schema:**
   - In your code, update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

5. **Update Vercel environment variable:**
   - Replace `DATABASE_URL` with your Supabase connection string

6. **Run migrations:**
   - In Vercel, go to Deployments
   - Click on latest deployment → "Functions" tab
   - Or run locally: `npx prisma migrate deploy`

### Option B: Railway PostgreSQL (Free)

1. **Sign up:** https://railway.app
2. **Create PostgreSQL database**
3. **Get connection string**
4. **Update Vercel environment variable**

## Quick Checklist

- [ ] Code pushed to GitHub ✅ (DONE!)
- [ ] Signed up for Vercel
- [ ] Imported repository
- [ ] Added environment variables
- [ ] Deployed to Vercel
- [ ] Connected domain (risque2.com)
- [ ] Set up database (Supabase/Railway)
- [ ] Set up Stripe webhook
- [ ] Test website!

## Need Help?

**If you get stuck on any step, let me know!**

**Most common issues:**
- Environment variables not set correctly
- Database connection issues (need PostgreSQL, not SQLite)
- DNS not propagating yet (wait 1-2 hours)

Let's get your website live! 🚀
