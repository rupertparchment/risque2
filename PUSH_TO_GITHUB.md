# Push Code to Your Existing Repository

## Your Repository
**URL:** https://github.com/rupertparchment/risque2  
**Status:** Empty (perfect!)

## Step-by-Step: Push Your Code

### Step 1: Open Terminal/Command Prompt

**Navigate to your website folder:**
```bash
cd C:\Users\rparc\OneDrive\Tabu\risque-website
```

### Step 2: Initialize Git (If Not Already Done)

```bash
git init
```

### Step 3: Add Your Repository

```bash
git remote add origin https://github.com/rupertparchment/risque2.git
```

### Step 4: Add All Files

```bash
git add .
```

### Step 5: Commit

```bash
git commit -m "Initial commit - Risqué website"
```

### Step 6: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

## Complete Command Sequence

**Copy and paste this entire block:**

```bash
cd C:\Users\rparc\OneDrive\Tabu\risque-website
git init
git remote add origin https://github.com/rupertparchment/risque2.git
git add .
git commit -m "Initial commit - Risqué website"
git branch -M main
git push -u origin main
```

## If Git Asks for Credentials

**You'll need to authenticate:**

**Option 1: Personal Access Token (Recommended)**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: "Vercel Deployment"
4. Select scopes: `repo` (full control)
5. Click "Generate token"
6. Copy the token
7. When Git asks for password, paste the token

**Option 2: GitHub Desktop (Easier)**
1. Download: https://desktop.github.com
2. Sign in with GitHub
3. Add repository: https://github.com/rupertparchment/risque2
4. Drag and drop your risque-website folder
5. Commit and push

## Verify It Worked

1. Go to: https://github.com/rupertparchment/risque2
2. You should see all your files
3. Ready for Vercel!

## Next Step: Connect to Vercel

Once code is on GitHub:
1. Go to Vercel
2. Click "Import Project"
3. Select: `rupertparchment/risque2`
4. Deploy!
