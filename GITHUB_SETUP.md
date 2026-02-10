# Setting Up GitHub Repository - Quick Guide

## Step 1: Create GitHub Account (If Needed)

1. Go to: https://github.com
2. Click "Sign up"
3. Create account (free)

## Step 2: Create New Repository

1. **Log into GitHub**
2. **Click the "+" icon** (top right) → "New repository"
3. **Repository name:** `risque-website` (or any name you want)
4. **Description:** "Risqué lifestyle club website" (optional)
5. **Visibility:** 
   - ✅ **Private** (recommended - keeps your code private)
   - Or Public (if you want it open)
6. **DO NOT check:**
   - ❌ "Add a README file"
   - ❌ "Add .gitignore"
   - ❌ "Choose a license"
7. **Click "Create repository"**

## Step 3: Push Your Code

**Open terminal/command prompt in your risque-website folder:**

### Windows (PowerShell or Command Prompt):

```bash
cd C:\Users\rparc\OneDrive\Tabu\risque-website
git init
git add .
git commit -m "Initial commit - Risqué website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/risque-website.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### If Git Asks for Credentials:

**Option 1: Use GitHub Desktop (Easier)**
- Download: https://desktop.github.com
- Sign in with GitHub
- Add repository
- Push code

**Option 2: Use Personal Access Token**
- GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Generate new token
- Use token as password when pushing

## Step 4: Verify Code is on GitHub

1. Go to your GitHub repository
2. You should see all your files
3. Ready for Vercel!

## Troubleshooting

**"git is not recognized"**
- Install Git: https://git-scm.com/download/win
- Restart terminal after installing

**"Repository not found"**
- Check repository name matches
- Check you're logged into GitHub
- Make sure repository exists

**"Permission denied"**
- Use Personal Access Token (see above)
- Or use GitHub Desktop

## Quick Copy-Paste Commands

**Replace YOUR_USERNAME with your GitHub username:**

```bash
cd C:\Users\rparc\OneDrive\Tabu\risque-website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/risque-website.git
git push -u origin main
```

## Alternative: Use GitHub Desktop (Easier)

If command line is confusing:

1. **Download GitHub Desktop:** https://desktop.github.com
2. **Install and sign in**
3. **File → Add Local Repository**
4. **Browse to:** `C:\Users\rparc\OneDrive\Tabu\risque-website`
5. **Click "Publish repository"**
6. **Choose name:** `risque-website`
7. **Click "Publish"**

Done! Much easier than command line.
