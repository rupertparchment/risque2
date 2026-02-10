# Bluehost DNS Troubleshooting - 403 Error

## The Problem

**Error:** "403 - Forbidden. Your session may have expired"

**Possible causes:**
- Session expired
- Bluehost system issue
- Need to refresh/re-login

## Solutions to Try

### Solution 1: Refresh and Try Again

1. **Log out of Bluehost completely**
2. **Close browser**
3. **Reopen browser**
4. **Log back into Bluehost**
5. **Try DNS Zone Editor again**

### Solution 2: Use Different Browser

1. **Try a different browser** (Chrome, Firefox, Edge)
2. **Log into Bluehost**
3. **Try DNS Zone Editor**

### Solution 3: Contact Bluehost Support

**If DNS Zone Editor isn't working:**

1. **Call Bluehost Support:**
   - Phone: Check Bluehost website for support number
   - Or use live chat

2. **Tell them:**
   - "I need to update DNS records for risque2.com"
   - "DNS Zone Editor is giving 403 error"
   - "I need to point my domain to Vercel"
   - "A record: @ → 216.198.79.1"
   - "CNAME: www → cname.vercel-dns.com"

3. **They can update it for you** (usually faster!)

### Solution 4: Use Bluehost Domain Manager

**Some Bluehost accounts have "Domain Manager" instead:**

1. **Look for "Domain Manager"** in cPanel
2. **Or "Advanced DNS"**
3. **Or "DNS Management"**

### Solution 5: Wait and Try Later

**Sometimes Bluehost has temporary issues:**
- Try again in 30 minutes
- System might be updating

## Alternative: Use Vercel's Nameservers (Easier!)

**Instead of updating individual DNS records, you can point entire domain to Vercel:**

### Step 1: Get Vercel Nameservers

1. **In Vercel Dashboard:**
   - Project → Settings → Domains
   - Click on risque2.com
   - Look for "Nameservers" option
   - Vercel will show nameservers like:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`

### Step 2: Update Nameservers in Bluehost

1. **In Bluehost cPanel:**
   - Look for "Nameservers" or "DNS Nameservers"
   - Change from Bluehost nameservers to Vercel nameservers
   - Save

**This is easier than updating individual DNS records!**

## What to Tell Bluehost Support

**If you call/chat with them:**

"I'm trying to point my domain risque2.com to Vercel hosting. I need to:
1. Update the A record for @ (root) to point to: 216.198.79.1
2. Add a CNAME record for www to point to: cname.vercel-dns.com

The DNS Zone Editor is giving me a 403 error. Can you help me update these DNS records?"

## Quick Checklist

- [ ] Tried logging out and back in
- [ ] Tried different browser
- [ ] Contacted Bluehost support
- [ ] Considered using Vercel nameservers instead
- [ ] Waited and tried again later

## My Recommendation

**Contact Bluehost Support:**
- They can update DNS records for you
- Usually faster than troubleshooting
- They have direct access to DNS settings

**Or use Vercel nameservers:**
- Easier than individual DNS records
- Vercel manages everything
- Less to configure

Let me know which approach you want to try!
