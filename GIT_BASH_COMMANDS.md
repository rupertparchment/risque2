# Git Bash Commands - Correct Syntax

## The Problem

You're using **Git Bash** (not Command Prompt), so paths work differently!

**In Git Bash:**
- ❌ `C:\Users\rparc` (doesn't work)
- ✅ `/c/Users/rparc` (works!)
- ✅ `~/OneDrive/Tabu/risque-website` (also works!)

## Correct Commands for Git Bash

### Step 1: Navigate to Your Home Directory

```bash
cd ~
```

**Or:**

```bash
cd /c/Users/rparc
```

### Step 2: Remove Git from Wrong Location (if needed)

```bash
rm -rf .git
```

### Step 3: Navigate to Website Folder

```bash
cd ~/OneDrive/Tabu/risque-website
```

**Or:**

```bash
cd /c/Users/rparc/OneDrive/Tabu/risque-website
```

### Step 4: Verify You're in Right Folder

```bash
ls
```

**You should see:**
- `package.json`
- `app/`
- `components/`
- `prisma/`
- etc.

### Step 5: Initialize Git

```bash
git init
git remote add origin https://github.com/rupertparchment/risque2.git
git add .
git commit -m "Initial commit - Risqué website"
git branch -M main
git push -u origin main
```

## Complete Sequence for Git Bash

**Copy and paste this ENTIRE block:**

```bash
cd ~
rm -rf .git
cd ~/OneDrive/Tabu/risque-website
ls
git init
git remote add origin https://github.com/rupertparchment/risque2.git
git add .
git commit -m "Initial commit - Risqué website"
git branch -M main
git push -u origin main
```

## Git Bash Path Format

**Windows paths in Git Bash:**

| Windows Format | Git Bash Format |
|----------------|-----------------|
| `C:\Users\rparc` | `/c/Users/rparc` |
| `C:\Users\rparc\OneDrive\Tabu\risque-website` | `/c/Users/rparc/OneDrive/Tabu/risque-website` |
| `C:\Users\rparc\OneDrive\Tabu\risque-website` | `~/OneDrive/Tabu/risque-website` |

**`~` = your home directory (`C:\Users\rparc`)**

## Quick Reference

**Navigate:**
- `cd ~` - Go to home directory
- `cd ~/OneDrive/Tabu/risque-website` - Go to website folder
- `cd /c/Users/rparc/OneDrive/Tabu/risque-website` - Same thing

**List files:**
- `ls` - List files (like `dir` in Command Prompt)
- `ls -la` - List all files including hidden

**Remove:**
- `rm -rf .git` - Remove Git repository

## Verify You're in Right Place

**Before running `git init`, check:**

```bash
pwd
```

**Should show:**
```
/c/Users/rparc/OneDrive/Tabu/risque-website
```

**Or:**

```bash
ls
```

**Should show website files, not personal folders.**

## Troubleshooting

**"No such file or directory"**
- Use forward slashes `/` not backslashes `\`
- Use `/c/` instead of `C:\`
- Or use `~/` for home directory

**"Permission denied"**
- Make sure you're in the right folder
- Check with `pwd` and `ls`

## Alternative: Use Windows Command Prompt Instead

**If Git Bash is confusing, use Command Prompt:**

1. **Close Git Bash**
2. **Open Command Prompt:**
   - Press Windows + R
   - Type: `cmd`
   - Press Enter
3. **Use the commands from FIX_WRONG_DIRECTORY.md**

**Command Prompt uses Windows paths:**
- `cd C:\Users\rparc\OneDrive\Tabu\risque-website`

## My Recommendation

**Since Git Bash paths are different, you have two options:**

1. **Use Git Bash** - Use the commands above with `/c/` or `~/`
2. **Use Command Prompt** - Easier paths, use `C:\` format

**Both work! Choose what's easier for you.**
