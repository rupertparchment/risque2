# Next Steps - Your Website is Built! 🎉

## ✅ What's Done

- ✅ Code pushed to GitHub
- ✅ Deployed to Vercel
- ✅ Build completed successfully
- ✅ Website is live (on Vercel URL)

## 🚀 What's Next

### Step 1: Add Environment Variables (Important!)

**In Vercel Dashboard:**
1. Go to your project
2. Click **"Settings"** → **"Environment Variables"**
3. Add these variables:

**Required:**
- `DATABASE_URL` = `file:./dev.db` (for now, will update to PostgreSQL)
- `NEXTAUTH_URL` = `https://risque2.com`
- `NEXTAUTH_SECRET` = (generate at https://generate-secret.vercel.app/32)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = (get from Stripe dashboard)
- `STRIPE_SECRET_KEY` = (get from Stripe dashboard)
- `ADMIN_EMAIL` = `admin@risque2.com`
- `ADMIN_PASSWORD` = (choose secure password)

**After adding variables:**
- Click **"Redeploy"** on latest deployment
- Or Vercel will auto-redeploy

### Step 2: Set Up Database (Required for Full Functionality)

**SQLite won't work on Vercel. You need PostgreSQL:**

**Option A: Supabase (Free - Recommended)**
1. Sign up: https://supabase.com
2. Create new project
3. Get connection string from Project Settings → Database
4. Update `DATABASE_URL` in Vercel
5. Update `prisma/schema.prisma` to use `postgresql` instead of `sqlite`
6. Run migrations

**Option B: Railway PostgreSQL (Free)**
1. Sign up: https://railway.app
2. Create PostgreSQL database
3. Get connection string
4. Update `DATABASE_URL` in Vercel

### Step 3: Connect Your Domain

1. **In Vercel:**
   - Project → Settings → Domains
   - Add `risque2.com` and `www.risque2.com`

2. **Update DNS in Bluehost:**
   - Vercel will show you DNS records to add
   - Update A record and CNAME in Bluehost cPanel
   - Wait 1-2 hours for DNS propagation

### Step 4: Set Up Stripe Webhook

**After domain is connected:**
1. Stripe Dashboard → Webhooks
2. Add endpoint: `https://risque2.com/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy webhook secret
5. Add `STRIPE_WEBHOOK_SECRET` to Vercel environment variables

### Step 5: Test Your Website

**Visit your Vercel URL:**
- Should see your Risqué website
- Test admin: `/admin`
- Test membership: `/membership`
- Test events: `/events`

## 📋 Quick Checklist

- [ ] Add environment variables in Vercel
- [ ] Redeploy after adding variables
- [ ] Set up PostgreSQL database (Supabase/Railway)
- [ ] Update DATABASE_URL in Vercel
- [ ] Update Prisma schema to use PostgreSQL
- [ ] Run database migrations
- [ ] Connect domain (risque2.com)
- [ ] Set up Stripe webhook
- [ ] Test website functionality

## 🎯 Priority Order

1. **Add environment variables** (do this first!)
2. **Set up database** (needed for events/admin)
3. **Connect domain** (make it live on risque2.com)
4. **Set up webhook** (for payments to work)

## 📞 Need Help?

**For environment variables:** See `VERCEL_ENV_VARIABLES.md`  
**For database setup:** See `VERCEL_DEPLOYMENT_GUIDE.md`  
**For domain setup:** See `VERCEL_DEPLOYMENT_GUIDE.md`

## 🎉 Congratulations!

Your website is built and deployed! Now it's time to:
- Add the environment variables
- Set up the database
- Connect your domain
- Start adding events and content!

Let me know which step you want to tackle first!
