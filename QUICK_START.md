# Quick Start - Get Your Website Live

## The Situation

✅ Bluehost: Domain registration (risque2.com) - **You're using this**  
✅ Vercel: Website hosting - **FREE**  
✅ Database: Supabase/Railway - **FREE**

## Fastest Path to Live Website

### 1. Push to GitHub (5 minutes)

```bash
cd risque-website
git init
git add .
git commit -m "Initial commit"
```

Then create repo on GitHub and push:
```bash
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy to Vercel (5 minutes)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your repository
4. Add environment variables (see VERCEL_DEPLOYMENT_GUIDE.md)
5. Deploy!

### 3. Connect Domain (10 minutes)

1. In Vercel → Settings → Domains
2. Add `risque2.com` and `www.risque2.com`
3. Update DNS in Bluehost (Vercel will show you what to do)
4. Wait 1-2 hours for DNS

### 4. Set Up Database (10 minutes)

1. Sign up for Supabase (free): https://supabase.com
2. Create project
3. Get connection string
4. Update `DATABASE_URL` in Vercel
5. Update Prisma schema to use PostgreSQL
6. Run migrations

## Total Time: ~30 minutes

## What You Need

- [ ] GitHub account (free)
- [ ] Vercel account (free)
- [ ] Supabase account (free)
- [ ] Stripe account (for payments)
- [ ] Bluehost DNS access

## Files to Reference

- `VERCEL_DEPLOYMENT_GUIDE.md` - Detailed step-by-step
- `BLUEHOST_CHECKLIST.md` - What to check
- `README.md` - Full documentation

## Ready?

Start with Step 1 (GitHub) and let me know if you need help!
