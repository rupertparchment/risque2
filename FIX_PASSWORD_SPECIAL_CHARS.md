# Fix: Invalid Port Number Error

## The Problem
The `#` character in your password (`Parchie!970#2026`) is breaking the URL parser. The `#` is a special character in URLs (used for fragments), so it must be URL-encoded.

## Solution Options

### Option 1: Reset Supabase Password (Easiest)

Reset your Supabase database password to something **without special characters**:

1. Go to **Supabase Dashboard** → Your Project → **Settings** → **Database**
2. Click **"Reset Database Password"**
3. **Copy the new password immediately** (save it somewhere safe)
4. Use this new password in your connection string (no encoding needed if it has no special chars)
5. Update in Vercel

**Recommended password format**: Use only letters, numbers, and maybe `-` or `_` (no `!`, `#`, `@`, etc.)

### Option 2: Properly URL-Encode the Password

If you want to keep the current password, you **must** URL-encode it:

- `!` = `%21`
- `#` = `%23`

So `Parchie!970#2026` becomes `Parchie%21%23970%232026`

**Transaction Pooling URL:**
```
postgresql://postgres.spuwqyknbdyicicxfomd:Parchie%21%23970%232026@aws-1-us-east-1.pooler.supabase.com:6543/postgres
```

**Direct Connection URL:**
```
postgresql://postgres:Parchie%21%23970%232026@db.spuwqyknbdyicicxfomd.supabase.co:5432/postgres
```

### Option 3: Use Supabase's Connection String Builder

1. Go to **Supabase Dashboard** → **Settings** → **Database**
2. Find **"Connection Pooling"** → **"Transaction"** mode
3. Click **"Connection String"** → **"URI"** tab
4. Supabase should provide a connection string with `[YOUR-PASSWORD]` placeholder
5. Copy that exact format
6. Replace `[YOUR-PASSWORD]` with your **URL-encoded** password: `Parchie%21%23970%232026`
7. Use that in Vercel

## Recommended: Reset Password

**I strongly recommend Option 1** - reset your Supabase password to something without special characters. It's much easier and less error-prone.

Example new password: `Parchie9702026` or `Risque2026!` (if you really need special chars, use `!` but avoid `#`)
