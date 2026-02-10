# Deploying Risqué Website to Bluehost

## Domain Information
- **Domain**: risque2.com
- **Hosting**: Bluehost

## Important Notes About Bluehost

⚠️ **Bluehost typically uses cPanel and may not support Next.js out of the box.**

Next.js requires Node.js hosting, which Bluehost's standard shared hosting may not support. You have a few options:

### Option 1: Use Bluehost's Node.js Hosting (If Available)

1. **Check if Bluehost supports Node.js:**
   - Log into your Bluehost cPanel
   - Look for "Node.js" or "Node.js Selector" in the control panel
   - If available, you can deploy there

2. **If Node.js is available:**
   - Create a Node.js application in cPanel
   - Upload your files via FTP or File Manager
   - Set Node.js version to 18 or higher
   - Set the start command: `npm start`
   - Point your domain to the Node.js app

### Option 2: Use Vercel (Recommended - Free & Easy)

Vercel is the easiest way to deploy Next.js apps and it's FREE:

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables (from your .env file)
   - Deploy!

3. **Connect your domain:**
   - In Vercel project settings → Domains
   - Add `risque2.com` and `www.risque2.com`
   - Update DNS records in Bluehost:
     - Add A record: `@` → Vercel IP (shown in Vercel)
     - Add CNAME: `www` → cname.vercel-dns.com

### Option 3: Use Railway or Render (Alternative)

Both support Next.js and are easy to deploy:

**Railway:**
- Go to https://railway.app
- Connect GitHub repo
- Deploy automatically
- Add custom domain

**Render:**
- Go to https://render.com
- Create new Web Service
- Connect GitHub repo
- Add custom domain

### Option 4: Upgrade Bluehost to VPS/Dedicated Server

If you want to stay with Bluehost:
- Upgrade to VPS or Dedicated hosting
- Install Node.js yourself
- Deploy the Next.js app

## Environment Variables for Production

When deploying, make sure to set these in your hosting platform:

```env
# Database (use PostgreSQL for production, not SQLite)
DATABASE_URL="postgresql://user:password@host:5432/risque"

# NextAuth
NEXTAUTH_URL="https://risque2.com"
NEXTAUTH_SECRET="generate-a-strong-random-string"

# Stripe (use LIVE keys for production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Admin
ADMIN_EMAIL="admin@risque2.com"
ADMIN_PASSWORD="your-secure-password"
```

## Database Setup for Production

**Important:** SQLite won't work well in production. Switch to PostgreSQL:

1. **Get PostgreSQL database:**
   - Bluehost may offer PostgreSQL
   - Or use a service like Supabase (free tier available)
   - Or Railway/Render include PostgreSQL

2. **Update Prisma schema:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

## Stripe Webhook Setup

1. **In Stripe Dashboard:**
   - Go to Developers → Webhooks
   - Add endpoint: `https://risque2.com/api/webhooks/stripe`
   - Select event: `checkout.session.completed`
   - Copy the webhook secret to your environment variables

## DNS Configuration

If using Vercel/Railway/Render with Bluehost domain:

1. **In Bluehost DNS settings:**
   - Remove default A record for @
   - Add A record: `@` → Your hosting IP (Vercel will show this)
   - Add CNAME: `www` → Your hosting CNAME

2. **Wait for DNS propagation** (can take up to 48 hours)

## Testing After Deployment

1. Visit https://risque2.com
2. Test admin login: https://risque2.com/admin
3. Test membership signup: https://risque2.com/membership
4. Test Stripe checkout (use test mode first)

## Recommended Approach

**For easiest deployment, I recommend Vercel:**
- ✅ Free tier available
- ✅ Built for Next.js (made by Next.js creators)
- ✅ Automatic SSL certificates
- ✅ Easy custom domain setup
- ✅ Automatic deployments from GitHub
- ✅ Built-in environment variable management

You can keep your domain registered with Bluehost and just point DNS to Vercel.

## Need Help?

If you run into issues:
1. Check Bluehost support for Node.js hosting
2. Consider Vercel for easier deployment
3. Make sure environment variables are set correctly
4. Verify database is accessible (if using external DB)
