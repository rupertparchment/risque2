# Troubleshooting DATABASE_URL in Vercel

## The Problem
Prisma can't read `DATABASE_URL` during the build process, even though you've added it to Vercel.

## Critical Steps to Fix

### 1. Verify Environment Variable is Set Correctly

In Vercel Dashboard → Settings → Environment Variables:

1. **Check the variable name**: Must be exactly `DATABASE_URL` (case-sensitive, no spaces)
2. **Check the value**: Should start with `postgresql://` (no quotes, no extra spaces)
3. **Check environments**: Must be checked for **Production** (and Preview/Development if you want)

### 2. Use Transaction Pooling URL (Correct Format)

```
postgresql://postgres.spuwqyknbdyicicxfomd:Parchie%21%23970%232026@aws-1-us-east-1.pooler.supabase.com:6543/postgres
```

**Important**: 
- Copy the ENTIRE string above (starts with `postgresql://`)
- Paste it directly into Vercel (no quotes, no extra spaces before/after)
- Make sure special characters are URL-encoded (`!` = `%21`, `#` = `%23`)

### 3. Delete and Recreate the Variable

Sometimes Vercel caches old values:

1. **Delete** the existing `DATABASE_URL` variable
2. **Add New** variable:
   - Name: `DATABASE_URL`
   - Value: `postgresql://postgres.spuwqyknbdyicicxfomd:Parchie%21%23970%232026@aws-1-us-east-1.pooler.supabase.com:6543/postgres`
   - Environments: Check **Production**, **Preview**, **Development**
3. Click **Save**

### 4. Create a NEW Deployment (Don't Just Redeploy)

After adding/updating the env var:

1. Go to **Deployments** tab
2. Click **"Deploy"** button (top right)
3. Select **"Deploy Latest Commit"**
4. This creates a fresh deployment with the new env vars

**OR** if you want to redeploy:
1. Click **"..."** on the latest deployment
2. Click **"Redeploy"**
3. Make sure **"Use existing Build Cache"** is **UNCHECKED** (important!)

### 5. Check Build Logs

After deploying, check the build logs:

1. Click on the deployment
2. Click **"Build Logs"** tab
3. Look for any errors about `DATABASE_URL`
4. Look for the line that runs `prisma generate` - does it succeed or fail?

### 6. Verify the Variable is Actually Set

Add a temporary API route to check (for debugging):

Create `app/api/debug/env/route.ts`:
```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL
  return NextResponse.json({
    hasDatabaseUrl: !!dbUrl,
    startsWithPostgres: dbUrl?.startsWith('postgresql://') || dbUrl?.startsWith('postgres://'),
    firstChars: dbUrl?.substring(0, 20) || 'NOT SET',
  })
}
```

Then visit: `https://www.risque2.com/api/debug/env` to see if the variable is being read.

**Remember to delete this debug route after testing!**

## Common Mistakes

1. ❌ Adding quotes around the value: `"postgresql://..."`
2. ❌ Extra spaces before/after the value
3. ❌ Wrong variable name: `database_url` or `DATABASE_URL ` (with space)
4. ❌ Only setting for Preview, not Production
5. ❌ Redeploying with cache enabled (doesn't pick up new env vars)
6. ❌ Not URL-encoding special characters in password

## Still Not Working?

If it still fails after all this:

1. Try the **Direct Connection** URL instead (from Supabase):
   ```
   postgresql://postgres:Parchie%21%23970%232026@db.spuwqyknbdyicicxfomd.supabase.co:5432/postgres
   ```

2. Check Supabase dashboard → Settings → Database → Connection Pooling
   - Make sure pooling is enabled
   - Try copying the connection string again (it might have changed)

3. Contact Vercel support or check Vercel logs for more details
