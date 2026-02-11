# Vercel Environment Variables Setup

## Required Environment Variables

You need to add these environment variables in Vercel for the site to work properly.

## How to Add Environment Variables in Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click on your project** (`risque2`)
3. **Go to Settings** → **Environment Variables** (in the left sidebar)
4. **Add each variable** using the "Add New" button

## Required Variables

### 1. DATABASE_URL (REQUIRED - Fixes current error)
```
postgresql://postgres:Parchie!970#2026@db.spuwqyknbdyicicxfomd.supabase.co:5432/postgres
```
- **Name**: `DATABASE_URL`
- **Value**: Your Supabase PostgreSQL connection string (above)
- **Environment**: Select all (Production, Preview, Development)

### 2. NEXTAUTH_URL (REQUIRED)
```
https://www.risque2.com
```
- **Name**: `NEXTAUTH_URL`
- **Value**: `https://www.risque2.com`
- **Environment**: Production only

### 3. ADMIN_EMAIL (REQUIRED for admin login)
- **Name**: `ADMIN_EMAIL`
- **Value**: Your admin email address (e.g., `admin@risque2.com`)
- **Environment**: All environments

### 4. ADMIN_PASSWORD (REQUIRED for admin login)
- **Name**: `ADMIN_PASSWORD`
- **Value**: Your admin password
- **Environment**: All environments

### 5. STRIPE_SECRET_KEY (REQUIRED for payments)
- **Name**: `STRIPE_SECRET_KEY`
- **Value**: Your Stripe secret key (starts with `sk_`)
- **Environment**: All environments

### 6. STRIPE_WEBHOOK_SECRET (REQUIRED for Stripe webhooks)
- **Name**: `STRIPE_WEBHOOK_SECRET`
- **Value**: Your Stripe webhook secret (starts with `whsec_`)
- **Environment**: Production only

### 7. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (REQUIRED for payment form)
- **Name**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Value**: Your Stripe publishable key (starts with `pk_`)
- **Environment**: All environments (must be public)

## Important Notes

1. **After adding variables**, you MUST **redeploy** for them to take effect:
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment → **"Redeploy"**

2. **DATABASE_URL** must start with `postgresql://` or `postgres://`

3. **NEXT_PUBLIC_*** variables are exposed to the browser - only use for public keys

4. **Never commit** `.env` files to GitHub - keep secrets in Vercel only

## Quick Checklist

- [ ] DATABASE_URL added
- [ ] NEXTAUTH_URL added
- [ ] ADMIN_EMAIL added
- [ ] ADMIN_PASSWORD added
- [ ] STRIPE_SECRET_KEY added (if using payments)
- [ ] STRIPE_WEBHOOK_SECRET added (if using payments)
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY added (if using payments)
- [ ] Redeployed after adding variables
