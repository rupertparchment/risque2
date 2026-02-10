# Install Git on Windows - Step by Step

## The Problem
**Error:** `'git' is not recognized as an internal or external command`

**Solution:** Install Git first!

## Step 1: Download Git

1. **Go to:** https://git-scm.com/download/win
2. **Click the download button** (it will auto-detect Windows)
3. **Save the file** (Git-2.x.x-64-bit.exe)

## Step 2: Install Git

1. **Double-click the downloaded file**
2. **Click "Next"** through the installer
3. **Important settings:**
   - ✅ Keep default options (they're fine)
   - ✅ Make sure "Git Bash Here" is checked
   - ✅ Choose "Use Visual Studio Code as Git's default editor" (or your preferred editor)
   - ✅ Choose "Git from the command line and also from 3rd-party software"
   - ✅ Use OpenSSL library
   - ✅ Checkout Windows-style, commit Unix-style line endings
   - ✅ Use MinTTY (default terminal)
   - ✅ Enable file system caching
   - ✅ Enable Git Credential Manager
4. **Click "Install"**
5. **Wait for installation** (2-3 minutes)
6. **Click "Finish"**

## Step 3: Restart Command Prompt

**IMPORTANT:** After installing Git, you MUST close and reopen Command Prompt!

1. **Close your current Command Prompt window**
2. **Open a NEW Command Prompt:**
   - Press Windows + R
   - Type: `cmd`
   - Press Enter

## Step 4: Verify Git is Installed

**In the NEW Command Prompt, type:**

```bash
git --version
```

**You should see something like:**
```
git version 2.42.0.windows.2
```

**If you see a version number, Git is installed! ✅**

## Step 5: Now Push Your Code

**Once Git is installed, run these commands:**

```bash
cd C:\Users\rparc\OneDrive\Tabu\risque-website
git init
git remote add origin https://github.com/rupertparchment/risque2.git
git add .
git commit -m "Initial commit - Risqué website"
git branch -M main
git push -u origin main
```

## Alternative: Use GitHub Desktop (No Git Installation Needed!)

**If you don't want to install Git, use GitHub Desktop instead:**

1. **Download:** https://desktop.github.com
2. **Install** (no Git needed - it's included)
3. **Sign in with GitHub**
4. **File → Add Local Repository**
5. **Browse to:** `C:\Users\rparc\OneDrive\Tabu\risque-website`
6. **Click "Publish repository"**
7. **Done!**

**GitHub Desktop includes Git, so you don't need to install it separately!**

## Quick Comparison

| Method | Need to Install Git? | Difficulty |
|--------|---------------------|------------|
| Command Prompt | ✅ Yes | Medium |
| GitHub Desktop | ❌ No (Git included) | Easy |

## My Recommendation

**Since you're new to Git, use GitHub Desktop:**
- ✅ No separate Git installation needed
- ✅ Visual interface (easier)
- ✅ Same result
- ✅ Less confusing

**Download:** https://desktop.github.com

## After Installing Git

**If you install Git:**
1. Close Command Prompt
2. Open NEW Command Prompt
3. Verify: `git --version`
4. Then run your commands

**If you use GitHub Desktop:**
1. Install GitHub Desktop
2. Sign in
3. Add repository
4. Publish
5. Done!

## Troubleshooting

**"git --version" still not working after install:**
- Make sure you closed and reopened Command Prompt
- Restart your computer if needed
- Check if Git is in PATH (usually automatic)

**Still having issues?**
- Use GitHub Desktop instead (easier!)
- Or let me know and I'll help troubleshoot
