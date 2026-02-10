# Deploy Risqué Website to Vercel - Step by Step

Since Bluehost doesn't support Node.js, we'll deploy to Vercel (free) and point your Bluehost domain to it.

## Why Vercel?

- ✅ **FREE** - Perfect for your needs
- ✅ Built by Next.js creators - perfect compatibility
- ✅ Automatic SSL certificates
- ✅ Easy custom domain setup
- ✅ Automatic deployments from GitHub
- ✅ You still use Bluehost (for domain)

## Step-by-Step Deployment

### Step 1: Push Code to GitHub

1. **Create GitHub account** (if you don't have one): https://github.com

2. **Create a new repository:**
   - Click "New repository"
   - Name: `risque-website` (or any name)
   - Make it Private (recommended)
   - Don't initialize with README
   - Click "Create repository"

3. **Push your code:**
   ```bash
   cd risque-website
   git init
   git add .
   git commit -m "Initial commit - Risqué website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/risque-website.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your GitHub username.

### Step 2: Deploy to Vercel

1. **Go to Vercel:** https://vercel.com

2. **Sign up/Login:**
   - Click "Sign Up"
   - Choose "Continue with GitHub"
   - Authorize Vercel to access GitHub

3. **Import Project:**
   - Click "Add New..." → "Project"
   - Import your `risque-website` repository
   - Click "Import"

4. **Configure Project:**
   - Framework Preset: **Next.js** (should auto-detect)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (should auto-fill)
   - Output Directory: `.next` (should auto-fill)
   - Install Command: `npm install` (should auto-fill)

5. **Add Environment Variables:**
   Click "Environment Variables" and add:

   ```
   DATABASE_URL=file:./dev.db
   ```
   (We'll update this later for production)

   ```
   NEXTAUTH_URL=https://risque2.com
   ```

   ```
   NEXTAUTH_SECRET=your-generated-secret-here
   ```
   Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

   ```
   STRIPE_SECRET_KEY=sk_test_...
   ```

   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
   (Get from Stripe Dashboard → Webhooks)

   ```
   ADMIN_EMAIL=admin@risque2.com
   ```

   ```
   ADMIN_PASSWORD=your-secure-password
   ```

6. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `risque-website.vercel.app`

### Step 3: Connect Your Domain (risque2.com)

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Settings" → "Domains"
   - Click "Add Domain"
   - Enter: `risque2.com`
   - Click "Add"
   - Also add: `www.risque2.com`

2. **Vercel will show DNS instructions:**
   - You'll see something like:
     - A record: `@` → `76.76.21.21`
     - CNAME: `www` → `cname.vercel-dns.com`

### Step 4: Update DNS in Bluehost

1. **Log into Bluehost cPanel**

2. **Go to DNS Zone Editor:**
   - Find "DNS Zone Editor" or "Advanced" → "DNS Zone Editor"
   - Select your domain: `risque2.com`

3. **Update DNS Records:**
   
   **Remove existing A record for @ (if exists):**
   - Find the A record pointing `@` to Bluehost IP
   - Delete it

   **Add new A record:**
   - Type: `A`
   - Name: `@` (or leave blank)
   - Points to: `76.76.21.21` (use the IP Vercel shows you)
   - TTL: `14400` (or default)
   - Click "Add Record"

   **Add CNAME for www:**
   - Type: `CNAME`
   - Name: `www`
   - Points to: `cname.vercel-dns.com` (or what Vercel shows)
   - TTL: `14400`
   - Click "Add Record"

4. **Save Changes**

### Step 5: Wait for DNS Propagation

- DNS changes can take 5 minutes to 48 hours
- Usually works within 1-2 hours
- Check status: https://dnschecker.org

### Step 6: Verify It's Working

1. Visit: https://risque2.com
2. Should see your Risqué website!
3. Test admin: https://risque2.com/admin
4. Test membership: https://risque2.com/membership

## Important: Database Setup

**SQLite won't work on Vercel.** You need PostgreSQL:

### Option A: Use Supabase (Free Tier)

1. **Sign up:** https://supabase.com
2. **Create new project**
3. **Get connection string:**
   - Go to Project Settings → Database
   - Copy "Connection string" (URI format)
   - Looks like: `postgresql://user:password@host:5432/dbname`

4. **Update Prisma schema:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

5. **Update environment variable in Vercel:**
   - Replace `DATABASE_URL` with your Supabase connection string

6. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

### Option B: Use Railway PostgreSQL (Free Tier)

1. **Sign up:** https://railway.app
2. **Create PostgreSQL database**
3. **Get connection string**
4. **Update Vercel environment variable**

## Stripe Webhook Setup

1. **In Stripe Dashboard:**
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://risque2.com/api/webhooks/stripe`
   - Select event: `checkout.session.completed`
   - Click "Add endpoint"
   - Copy the "Signing secret" (starts with `whsec_`)

2. **Update Vercel environment variable:**
   - Add/update: `STRIPE_WEBHOOK_SECRET` with the signing secret

## Summary

✅ **You're using:**
- Bluehost: Domain registration & DNS
- Vercel: Website hosting (free)
- Supabase/Railway: Database (free tier)

✅ **Cost:**
- Bluehost: Already paid
- Vercel: FREE
- Database: FREE (Supabase/Railway free tier)

✅ **Result:**
- Website works perfectly
- Still using Bluehost (domain)
- No additional hosting costs

## Need Help?

If you get stuck on any step, let me know and I'll help!
