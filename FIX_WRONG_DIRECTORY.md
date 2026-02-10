# Fix: Wrong Directory Issue

## The Problem

You ran `git init` in the wrong folder! You're in:
- ❌ `C:\Users\rparc\` (your home folder - WRONG!)

You need to be in:
- ✅ `C:\Users\rparc\OneDrive\Tabu\risque-website` (your website folder - CORRECT!)

## Step 1: Remove Git from Wrong Location

**First, let's clean up the mistake:**

1. **In Command Prompt, type:**
```bash
cd C:\Users\rparc
```

2. **Remove the Git repository:**
```bash
rmdir /s .git
```

**Or if that doesn't work:**
```bash
rmdir /s /q .git
```

**This removes the Git repository from your home folder (safe - it won't delete your files)**

## Step 2: Navigate to Correct Folder

**Now go to the RIGHT folder:**

```bash
cd C:\Users\rparc\OneDrive\Tabu\risque-website
```

**Verify you're in the right place:**

```bash
dir
```

**You should see files like:**
- `package.json`
- `app/`
- `components/`
- `prisma/`
- etc.

**If you see your personal folders (Desktop, Documents, etc.), you're still in the wrong place!**

## Step 3: Initialize Git in Correct Folder

**Now that you're in the right folder:**

```bash
git init
```

**Then:**

```bash
git remote add origin https://github.com/rupertparchment/risque2.git
```

**Then:**

```bash
git add .
```

**Then:**

```bash
git commit -m "Initial commit - Risqué website"
```

**Then:**

```bash
git branch -M main
```

**Then:**

```bash
git push -u origin main
```

## Complete Correct Sequence

**Copy and paste this ENTIRE block:**

```bash
cd C:\Users\rparc
rmdir /s /q .git
cd C:\Users\rparc\OneDrive\Tabu\risque-website
git init
git remote add origin https://github.com/rupertparchment/risque2.git
git add .
git commit -m "Initial commit - Risqué website"
git branch -M main
git push -u origin main
```

## How to Know You're in the Right Folder

**Before running `git init`, check your prompt:**

**WRONG:**
```
C:\Users\rparc>
```

**CORRECT:**
```
C:\Users\rparc\OneDrive\Tabu\risque-website>
```

**Or run `dir` and you should see:**
- `package.json`
- `app` (folder)
- `components` (folder)
- `prisma` (folder)
- etc.

**NOT:**
- `Desktop`
- `Documents`
- `Downloads`
- etc.

## Visual Guide

**What you should see:**

```
C:\Users\rparc>cd C:\Users\rparc\OneDrive\Tabu\risque-website

C:\Users\rparc\OneDrive\Tabu\risque-website>dir
 Volume in drive C is Windows
 Directory of C:\Users\rparc\OneDrive\Tabu\risque-website

2026-02-10  03:00 PM    <DIR>          .
2026-02-10  03:00 PM    <DIR>          ..
2026-02-10  03:00 PM             1,234 package.json
2026-02-10  03:00 PM    <DIR>          app
2026-02-10  03:00 PM    <DIR>          components
                ... (website files)

C:\Users\rparc\OneDrive\Tabu\risque-website>git init
Initialized empty Git repository...

C:\Users\rparc\OneDrive\Tabu\risque-website>git add .
```

## Important: Always Check Your Location

**Before running Git commands, always check:**

```bash
cd
```

**This shows your current directory**

**Or:**

```bash
dir
```

**This shows files in current folder**

## Alternative: Use GitHub Desktop (Easier!)

**If this is confusing, use GitHub Desktop:**

1. **Download:** https://desktop.github.com
2. **Install and sign in**
3. **File → Add Local Repository**
4. **Browse to:** `C:\Users\rparc\OneDrive\Tabu\risque-website`
5. **It will automatically be in the right folder!**
6. **Click "Publish repository"**

**Much easier - no navigating folders!**
