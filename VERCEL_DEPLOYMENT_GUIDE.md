# Vercel Deployment Guide

## Manual Deployment (Current Method)

Since auto-deploy isn't working, follow these steps after each `git push`:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click on your project** (`risque2`)
3. **Go to "Deployments" tab**
4. **Click "Redeploy"** on the latest deployment, OR
5. **Click "Deploy" button** → Select "Deploy Latest Commit"

## Enable Auto-Deploy (Recommended)

To make Vercel automatically deploy when you push to GitHub:

### Step 1: Check GitHub Integration
1. Go to Vercel Dashboard → Your Project → **Settings**
2. Click **"Git"** in the left sidebar
3. Verify that:
   - **Repository** shows: `rupertparchment/risque2`
   - **Production Branch** is set to `main`
   - **Auto-deploy** is **enabled** (toggle should be ON)

### Step 2: Reconnect GitHub (if needed)
If the integration looks broken:
1. In Vercel Settings → Git
2. Click **"Disconnect"** (if shown)
3. Click **"Connect Git Repository"**
4. Select **GitHub**
5. Authorize Vercel to access your GitHub
6. Select repository: `rupertparchment/risque2`
7. Click **"Import"**

### Step 3: Verify Webhook
1. Go to your GitHub repo: https://github.com/rupertparchment/risque2
2. Click **Settings** → **Webhooks**
3. You should see a webhook from Vercel
4. If missing, Vercel should create it automatically when you reconnect

## Quick Deploy Workflow

**Current workflow (manual):**
```bash
# 1. Make changes to code
# 2. Commit and push
git add .
git commit -m "Your message"
git push origin main

# 3. Go to Vercel dashboard and click "Redeploy"
```

**Future workflow (auto-deploy):**
```bash
# 1. Make changes to code
# 2. Commit and push
git add .
git commit -m "Your message"
git push origin main

# 3. Vercel automatically deploys! (check dashboard for status)
```

## Troubleshooting

**If "Redeploy" button is grayed out:**
- Make sure you've pushed the latest code to GitHub first
- Check that the latest commit shows in GitHub

**If deployment fails:**
- Check the deployment logs in Vercel
- Look for error messages (usually build errors or missing environment variables)
- Make sure all environment variables are set in Vercel Settings → Environment Variables
