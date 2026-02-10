# Vercel Environment Variables - Quick Reference

## Copy-Paste Ready List

**Add these in Vercel → Project Settings → Environment Variables:**

### 1. DATABASE_URL
```
file:./dev.db
```
*(Update to PostgreSQL connection string for production)*

### 2. NEXTAUTH_URL
```
https://risque2.com
```

### 3. NEXTAUTH_SECRET
*(Generate with: https://generate-secret.vercel.app/32)*
```
[generated-secret-here]
```

### 4. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
*(Get from: https://dashboard.stripe.com/test/apikeys)*
```
pk_test_...
```

### 5. STRIPE_SECRET_KEY
*(Get from: https://dashboard.stripe.com/test/apikeys)*
```
sk_test_...
```

### 6. STRIPE_WEBHOOK_SECRET
*(Set up after domain is connected)*
```
whsec_...
```

### 7. ADMIN_EMAIL
```
admin@risque2.com
```

### 8. ADMIN_PASSWORD
```
[your-secure-password]
```

## Where to Get Values

### NEXTAUTH_SECRET
**Generate online:**
- https://generate-secret.vercel.app/32
- Copy the generated string

**Or generate locally:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Stripe Keys
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy "Publishable key" (pk_test_...)
3. Copy "Secret key" (sk_test_...)
4. Click "Reveal test key" if needed

### Database URL (For Production)
**After setting up Supabase/Railway:**
- Get connection string from your database provider
- Update `DATABASE_URL` in Vercel
- Update `prisma/schema.prisma` to use `postgresql`

## Important Notes

1. **Use test Stripe keys for now** (pk_test_ and sk_test_)
2. **Switch to live keys** when ready for real payments
3. **Database must be PostgreSQL** (not SQLite) for Vercel
4. **Webhook secret** comes after domain is connected

## Step-by-Step

1. **Add all variables** (except webhook secret)
2. **Deploy**
3. **Connect domain**
4. **Set up webhook** (get secret from Stripe)
5. **Add webhook secret** to Vercel
6. **Set up database** (Supabase/Railway)
7. **Update DATABASE_URL**
8. **Redeploy**

Ready to deploy! 🚀
