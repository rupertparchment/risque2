# Add Environment Variables After Deployment

## No Problem! You Can Add Them Now

**Vercel will automatically redeploy when you add environment variables.**

## Step 1: Go to Project Settings

1. **In Vercel Dashboard:**
   - Click on your project (`risque2` or similar)
   - Click **"Settings"** (top menu)
   - Click **"Environment Variables"** (left sidebar)

## Step 2: Add Environment Variables

**Click "Add New" for each variable:**

### 1. DATABASE_URL
- **Key:** `DATABASE_URL`
- **Value:** `file:./dev.db`
- **Environment:** Select all (Production, Preview, Development)
- **Click "Save"**

### 2. NEXTAUTH_URL
- **Key:** `NEXTAUTH_URL`
- **Value:** `https://risque2.com`
- **Environment:** Select all
- **Click "Save"**

### 3. NEXTAUTH_SECRET
**Generate a secret first:**
- Go to: https://generate-secret.vercel.app/32
- Copy the generated string

- **Key:** `NEXTAUTH_SECRET`
- **Value:** `[paste-generated-secret]`
- **Environment:** Select all
- **Click "Save"**

### 4. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
**Get from Stripe:**
- Go to: https://dashboard.stripe.com/test/apikeys
- Copy "Publishable key" (starts with `pk_test_`)

- **Key:** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Value:** `pk_test_...`
- **Environment:** Select all
- **Click "Save"**

### 5. STRIPE_SECRET_KEY
**Get from Stripe:**
- Same page as above
- Copy "Secret key" (starts with `sk_test_`)
- Click "Reveal test key" if needed

- **Key:** `STRIPE_SECRET_KEY`
- **Value:** `sk_test_...`
- **Environment:** Select all
- **Click "Save"**

### 6. ADMIN_EMAIL
- **Key:** `ADMIN_EMAIL`
- **Value:** `admin@risque2.com`
- **Environment:** Select all
- **Click "Save"**

### 7. ADMIN_PASSWORD
- **Key:** `ADMIN_PASSWORD`
- **Value:** `[your-secure-password]`
- **Environment:** Select all
- **Click "Save"**

## Step 3: Redeploy

**After adding all variables:**

1. **Go to "Deployments" tab**
2. **Click the three dots** (⋯) on the latest deployment
3. **Click "Redeploy"**
4. **Or Vercel may auto-redeploy** (check the deployments tab)

## Step 4: Verify

**After redeploy, check:**
- Deployment should show "Ready" status
- Visit your Vercel URL (risque2-abc123.vercel.app)
- Website should load!

## Important Notes

**For now, these are fine:**
- ✅ DATABASE_URL = `file:./dev.db` (will need PostgreSQL later)
- ✅ Stripe test keys (pk_test_ and sk_test_)

**Later, you'll need to:**
- Update DATABASE_URL to PostgreSQL (Supabase/Railway)
- Set up Stripe webhook (after domain is connected)
- Switch to live Stripe keys (when ready for real payments)

## Quick Checklist

- [ ] Added DATABASE_URL
- [ ] Added NEXTAUTH_URL
- [ ] Added NEXTAUTH_SECRET (generated)
- [ ] Added NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- [ ] Added STRIPE_SECRET_KEY
- [ ] Added ADMIN_EMAIL
- [ ] Added ADMIN_PASSWORD
- [ ] Redeployed

## Need Help Getting Values?

**NEXTAUTH_SECRET:**
- Generate: https://generate-secret.vercel.app/32

**Stripe Keys:**
- Get from: https://dashboard.stripe.com/test/apikeys
- (Sign up for Stripe if you haven't)

**Everything else:**
- Just copy from the list above!

You're all set! Add the variables and redeploy. 🚀
