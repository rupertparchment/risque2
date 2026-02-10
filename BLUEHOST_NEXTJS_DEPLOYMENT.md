# Deploying Next.js to Bluehost - Complete Guide

Since you're locked into Bluehost for a year, here are your options:

## Option 1: Check if Bluehost Supports Node.js (Best Case)

Many Bluehost plans now include Node.js support. Let's check:

### Steps to Check:

1. **Log into Bluehost cPanel**
2. **Look for "Node.js" or "Node.js Selector"** in the control panel
3. **If you see it:**
   - You're in luck! Follow the deployment steps below
   - You can deploy Next.js directly on Bluehost

### If Node.js is Available - Deployment Steps:

1. **Create Node.js App in cPanel:**
   - Go to "Node.js Selector" or "Node.js" in cPanel
   - Click "Create Application"
   - Select Node.js version 18 or higher
   - Set application root: `/home/username/public_html/risque` (or similar)
   - Set application URL: `risque2.com`
   - Set startup file: `server.js` (we'll create this)

2. **Upload Your Files:**
   - Use File Manager or FTP
   - Upload all files to your application root
   - Make sure `.env` file is uploaded (with production values)

3. **Create server.js for Bluehost:**
   ```javascript
   const { createServer } = require('http')
   const { parse } = require('url')
   const next = require('next')

   const dev = process.env.NODE_ENV !== 'production'
   const hostname = 'localhost'
   const port = process.env.PORT || 3000

   const app = next({ dev, hostname, port })
   const handle = app.getRequestHandler()

   app.prepare().then(() => {
     createServer(async (req, res) => {
       try {
         const parsedUrl = parse(req.url, true)
         await handle(req, res, parsedUrl)
       } catch (err) {
         console.error('Error occurred handling', req.url, err)
         res.statusCode = 500
         res.end('internal server error')
       }
     }).listen(port, (err) => {
       if (err) throw err
       console.log(`> Ready on http://${hostname}:${port}`)
     })
   })
   ```

4. **Update package.json scripts:**
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "build": "next build",
       "dev": "next dev"
     }
   }
   ```

5. **Install Dependencies:**
   - In cPanel Terminal or SSH, run: `npm install`
   - Then: `npm run build`

6. **Set Environment Variables:**
   - In Node.js app settings in cPanel
   - Add all your environment variables

7. **Start the Application:**
   - Click "Start" in Node.js app settings

## Option 2: Use Bluehost Domain with External Hosting (Recommended)

**You can keep your Bluehost account and domain, but host the website elsewhere:**

### Why This Works:
- ✅ You keep your Bluehost domain registration
- ✅ Website runs on proper Next.js hosting
- ✅ Still "using" your Bluehost account
- ✅ Much easier deployment

### Steps:

1. **Deploy to Vercel (Free):**
   - Push code to GitHub
   - Deploy on Vercel (free tier)
   - Get Vercel deployment URL

2. **Point Bluehost Domain to Vercel:**
   - In Bluehost cPanel → DNS Zone Editor
   - Remove default A record for `@`
   - Add A record: `@` → Vercel IP (Vercel will show you)
   - Add CNAME: `www` → `cname.vercel-dns.com`
   - Or use Vercel's nameservers (easier)

3. **In Vercel:**
   - Go to Project Settings → Domains
   - Add `risque2.com` and `www.risque2.com`
   - Follow DNS instructions

**Result:** Your domain (risque2.com) points to Vercel, but you're still using Bluehost for the domain registration.

## Option 3: Upgrade Bluehost Plan (If Needed)

If your current plan doesn't support Node.js:

1. **Contact Bluehost Support:**
   - Ask if they can add Node.js support
   - Or upgrade to VPS (may cost extra)

2. **VPS Hosting:**
   - Full control to install Node.js
   - Can deploy Next.js properly
   - More technical setup required

## Option 4: Static Export (Limited Functionality)

If nothing else works, you can export Next.js as static HTML:

**Limitations:**
- ❌ No API routes (no Stripe, no admin panel)
- ❌ No server-side features
- ❌ Limited functionality

**Not recommended** for your use case since you need:
- Stripe payments
- Admin panel
- Database

## Recommended Approach

**Since you're locked into Bluehost:**

1. **Check for Node.js support first** (Option 1)
   - If available, deploy directly on Bluehost
   - Use the server.js file I'll create

2. **If no Node.js support:**
   - Use Option 2 (domain with Vercel hosting)
   - You're still using Bluehost (for domain)
   - Website runs properly on Vercel
   - Free hosting on Vercel

3. **Contact Bluehost Support:**
   - Ask: "Do you support Node.js applications?"
   - Ask: "Can I deploy a Next.js app?"
   - They may have solutions

## Files You'll Need

I'll create:
- `server.js` - For Bluehost Node.js deployment
- Updated `package.json` - With start script
- Deployment checklist

## Next Steps

1. **Check your Bluehost cPanel** for Node.js support
2. **Let me know what you find** and I'll help with the specific deployment
3. **If no Node.js**, we'll set up Vercel + Bluehost DNS

You're not stuck! Even if Bluehost doesn't support Next.js directly, you can still use your domain with proper hosting.
