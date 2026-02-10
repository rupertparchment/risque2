# Using Your Existing Git Repository

## Option 1: Use Existing Repository (If It's Empty or You Want to Replace It)

**If your existing repo is empty or you want to replace its contents:**

```bash
cd C:\Users\rparc\OneDrive\Tabu\risque-website
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git add .
git commit -m "Risqué website - initial commit"
git push -u origin main
```

**Or if the repo already has content and you want to replace it:**

```bash
cd C:\Users\rparc\OneDrive\Tabu\risque-website
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git add .
git commit -m "Risqué website"
git push -u origin main --force
```

⚠️ **Warning:** `--force` will overwrite existing content in the repo!

## Option 2: Create New Repository (Recommended)

**Better to keep projects separate:**

1. **Create new repo on GitHub:**
   - Name: `risque-website` or `risque-club` or similar
   - Keep it separate from other projects

2. **Push to new repo:**
   ```bash
   cd C:\Users\rparc\OneDrive\Tabu\risque-website
   git init
   git add .
   git commit -m "Initial commit - Risqué website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/risque-website.git
   git push -u origin main
   ```

## Option 3: Use Existing Repo as Subfolder

**If you want to keep existing repo but add this as a folder:**

```bash
cd C:\Users\rparc\OneDrive\Tabu\YOUR_EXISTING_REPO
git submodule add https://github.com/YOUR_USERNAME/risque-website.git risque-website
```

**Or simpler - just add folder to existing repo:**

```bash
cd C:\Users\rparc\OneDrive\Tabu\YOUR_EXISTING_REPO
# Copy risque-website folder into this repo
git add risque-website
git commit -m "Add Risqué website"
git push
```

## What Vercel Needs

**Vercel just needs:**
- ✅ A Git repository (GitHub, GitLab, or Bitbucket)
- ✅ Your code in that repository
- ✅ Access to that repository

**It doesn't matter if:**
- The repo is new or existing
- The repo has other projects in it
- You use a subfolder

## Best Practice: Separate Repository

**I recommend creating a NEW repository:**
- ✅ Keeps projects separate
- ✅ Easier to manage
- ✅ Cleaner for Vercel deployment
- ✅ Better organization

**But you CAN use existing repo if you want!**

## Quick Decision Guide

**Use existing repo if:**
- It's empty
- You want to replace its contents
- You're okay mixing projects

**Create new repo if:**
- Existing repo has other projects
- You want to keep things separate
- You want cleaner organization

## Steps to Use Existing Repo

1. **Get your repo URL:**
   - Go to GitHub
   - Open your repository
   - Click "Code" button
   - Copy the HTTPS URL

2. **Push code to it:**
   ```bash
   cd C:\Users\rparc\OneDrive\Tabu\risque-website
   git init
   git remote add origin YOUR_REPO_URL
   git add .
   git commit -m "Risqué website"
   git push -u origin main
   ```

3. **In Vercel:**
   - Import that repository
   - Vercel will detect it's a Next.js app
   - Deploy!

## What's Your Situation?

**Tell me:**
- Do you have an existing repo?
- Is it empty or does it have other code?
- Do you want to keep things separate?

**I can give you the exact commands based on your situation!**
