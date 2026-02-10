# Quick Setup Guide for Risqué Website

## ✅ What's Already Done

All website files are created and ready:
- ✅ All pages (Home, About, Events, Gallery, Membership, Contact, Admin)
- ✅ Database schema (Prisma)
- ✅ Stripe payment integration
- ✅ Admin panel for managing events
- ✅ Mobile-responsive design

## 🚀 What You Need to Do

### Step 1: Install Node.js (if not already installed)

1. Download Node.js from: https://nodejs.org/
2. Install version 18 or higher
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Dependencies

Open terminal/command prompt in the `risque-website` folder and run:

```bash
npm install
```

This will install all required packages (Next.js, Prisma, Stripe, etc.)

### Step 3: Set Up Environment Variables

1. Create a `.env` file in the `risque-website` folder
2. Copy this content and fill in your values:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="https://risque2.com"
NEXTAUTH_SECRET="generate-a-random-string-here"

# Stripe (get from https://stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Admin Login
ADMIN_EMAIL="admin@risque2.com"
ADMIN_PASSWORD="your-secure-password"
```

**To generate NEXTAUTH_SECRET:**
- Windows: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- Mac/Linux: `openssl rand -base64 32`

**To get Stripe keys:**
1. Sign up at https://stripe.com
2. Go to Dashboard → Developers → API keys
3. Copy your test keys (use test keys for development)

### Step 4: Set Up Database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This creates your database and tables.

### Step 5: Run the Website

```bash
npm run dev
```

Then open: http://localhost:3000

## 📋 Checklist

- [ ] Node.js installed (v18+)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with all variables
- [ ] Database initialized (`npx prisma migrate dev`)
- [ ] Website running (`npm run dev`)

## 🎯 First Things to Do After Setup

1. **Test Admin Panel:**
   - Go to http://localhost:3000/admin
   - Login with your admin credentials
   - Create your first event

2. **Test Membership Signup:**
   - Go to http://localhost:3000/membership
   - Fill out the form
   - Test with Stripe test card: `4242 4242 4242 4242`

3. **Add Gallery Images:**
   - Go to Admin → Gallery
   - Upload interior photos

## 🚨 Common Issues

**"npm is not recognized"**
- Node.js is not installed or not in PATH
- Reinstall Node.js and restart terminal

**"Cannot find module"**
- Run `npm install` again
- Delete `node_modules` folder and `package-lock.json`, then run `npm install`

**Database errors**
- Make sure you ran `npx prisma generate` and `npx prisma migrate dev`
- Check that `DATABASE_URL` in `.env` is correct

**Stripe errors**
- Make sure Stripe keys are correct in `.env`
- Use test keys (start with `pk_test_` and `sk_test_`)

## 📞 Need Help?

The website is fully built and ready. If you run into issues during setup, let me know and I can help troubleshoot!
