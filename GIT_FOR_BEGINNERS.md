# Git for Beginners - Where to Run Commands

## Where to Run Git Commands

**You can use EITHER:**
- ✅ **Command Prompt** (Windows)
- ✅ **PowerShell** (Windows)
- ✅ **Git Bash** (if you installed Git)

**They all work the same!**

## Option 1: Command Prompt (Easiest)

### Step 1: Open Command Prompt

1. **Press Windows key + R**
2. **Type:** `cmd`
3. **Press Enter**

**OR**

1. **Click Start menu**
2. **Type:** `Command Prompt` or `cmd`
3. **Click on it**

### Step 2: Navigate to Your Folder

**Copy and paste this command:**

```bash
cd C:\Users\rparc\OneDrive\Tabu\risque-website
```

**Press Enter**

### Step 3: Run Git Commands

**Copy and paste these one at a time:**

```bash
git init
```

**Press Enter, then:**

```bash
git remote add origin https://github.com/rupertparchment/risque2.git
```

**Press Enter, then:**

```bash
git add .
```

**Press Enter, then:**

```bash
git commit -m "Initial commit - Risqué website"
```

**Press Enter, then:**

```bash
git branch -M main
```

**Press Enter, then:**

```bash
git push -u origin main
```

**Press Enter**

### Step 4: Enter Credentials

**When it asks for username:**
- Type: `rupertparchment`
- Press Enter

**When it asks for password:**
- Use a Personal Access Token (NOT your GitHub password)
- See instructions below for getting token

## Option 2: PowerShell (Also Works)

**Same steps, just open PowerShell instead:**

1. **Press Windows key + X**
2. **Click "Windows PowerShell"**
3. **Run the same commands**

## Option 3: GitHub Desktop (EASIEST - Recommended!)

**If command line seems confusing, use GitHub Desktop:**

### Step 1: Download GitHub Desktop

1. Go to: https://desktop.github.com
2. Click "Download for Windows"
3. Install it

### Step 2: Sign In

1. Open GitHub Desktop
2. Sign in with your GitHub account
3. Authorize it

### Step 3: Add Your Repository

1. **File → Add Local Repository**
2. **Click "Choose..."**
3. **Browse to:** `C:\Users\rparc\OneDrive\Tabu\risque-website`
4. **Click "Add repository"**

### Step 4: Publish to GitHub

1. **Click "Publish repository"** (top right)
2. **Name:** `risque2` (or leave as is)
3. **Make sure:** "Keep this code private" is unchecked (or checked, your choice)
4. **Click "Publish repository"**

**Done! Much easier than command line!**

## Getting Personal Access Token (For Command Line)

**If using Command Prompt/PowerShell, you'll need this:**

1. **Go to:** https://github.com/settings/tokens
2. **Click:** "Generate new token" → "Generate new token (classic)"
3. **Name it:** "Vercel Deployment"
4. **Select:** `repo` (check the box)
5. **Scroll down, click:** "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. **When Git asks for password, paste this token**

## Visual Guide: Command Prompt

**What you'll see:**

```
C:\Users\rparc>cd C:\Users\rparc\OneDrive\Tabu\risque-website

C:\Users\rparc\OneDrive\Tabu\risque-website>git init
Initialized empty Git repository...

C:\Users\rparc\OneDrive\Tabu\risque-website>git remote add origin https://github.com/rupertparchment/risque2.git

C:\Users\rparc\OneDrive\Tabu\risque-website>git add .

C:\Users\rparc\OneDrive\Tabu\risque-website>git commit -m "Initial commit - Risqué website"
[main (root-commit) abc1234] Initial commit - Risqué website
 50 files changed, 5000 insertions(+)

C:\Users\rparc\OneDrive\Tabu\risque-website>git push -u origin main
Username for 'https://github.com': rupertparchment
Password for 'https://rupertparchment@github.com': [paste your token here]
```

## Troubleshooting

**"git is not recognized"**
- Git isn't installed
- Download: https://git-scm.com/download/win
- Install it, restart Command Prompt

**"cd: cannot find path"**
- Check the folder path is correct
- Make sure risque-website folder exists

**"Permission denied"**
- Use Personal Access Token (not password)
- Make sure token has `repo` permission

## My Recommendation for Beginners

**Use GitHub Desktop!**

- ✅ No command line needed
- ✅ Visual interface
- ✅ Easier to understand
- ✅ Same result

**Download here:** https://desktop.github.com

## Quick Comparison

| Method | Difficulty | Speed |
|--------|-----------|-------|
| GitHub Desktop | ⭐ Easy | 5 minutes |
| Command Prompt | ⭐⭐ Medium | 5 minutes |
| PowerShell | ⭐⭐ Medium | 5 minutes |

**All work the same - choose what's easiest for you!**
