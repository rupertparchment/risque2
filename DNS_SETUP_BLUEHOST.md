# Update DNS Records in Bluehost

## What You Need to Do

**Vercel wants you to add this DNS record:**
- **Type:** A
- **Name:** `@` (or leave blank)
- **Value:** `216.198.79.1`

## Step-by-Step: Update DNS in Bluehost

### Step 1: Log into Bluehost cPanel

1. **Go to:** https://my.bluehost.com
2. **Log in**
3. **Go to cPanel**

### Step 2: Find DNS Zone Editor

1. **In cPanel, look for "DNS Zone Editor"**
   - Might be under "Domains" section
   - Or "Advanced" section
   - Or search for "DNS"

2. **Click "DNS Zone Editor"**

### Step 3: Select Your Domain

1. **Select domain:** `risque2.com`
2. **Click "Manage"** or the domain name

### Step 4: Remove Old A Record

**Find the existing A record for `@` (or blank name):**
- It probably points to Bluehost's IP (something like `162.xxx.xxx.xxx`)
- **Delete this record:**
  - Click "Delete" or trash icon
  - Confirm deletion

### Step 5: Add New A Record

1. **Click "Add Record"** or "+" button
2. **Fill in:**
   - **Type:** `A`
   - **Name:** `@` (or leave blank - means root domain)
   - **TTL:** `14400` (or default)
   - **Points to:** `216.198.79.1`
3. **Click "Add Record"** or "Save"

### Step 6: Add CNAME for www (Optional but Recommended)

1. **Click "Add Record"** again
2. **Fill in:**
   - **Type:** `CNAME`
   - **Name:** `www`
   - **TTL:** `14400` (or default)
   - **Points to:** `cname.vercel-dns.com`
3. **Click "Add Record"** or "Save"

### Step 7: Verify Records

**You should now have:**
- A record: `@` → `216.198.79.1`
- CNAME record: `www` → `cname.vercel-dns.com`

**Make sure there are NO other A records for `@`**

## Wait for DNS Propagation

**After updating DNS:**
- **Can take 5 minutes to 48 hours**
- **Usually works within 1-2 hours**
- **Check status:** https://dnschecker.org

**To check if it's working:**
1. Visit: https://risque2.com
2. Should see your Risqué website (not Bluehost placeholder)
3. If still seeing Bluehost, wait longer

## Troubleshooting

**Still seeing Bluehost page after 2 hours?**

1. **Check DNS records are correct:**
   - Go to: https://dnschecker.org
   - Type: `risque2.com`
   - Check A record points to `216.198.79.1`

2. **Clear browser cache:**
   - Try incognito/private window
   - Or clear browser cache

3. **Check Bluehost DNS:**
   - Make sure you saved the records
   - Make sure old A record is deleted
   - Make sure no conflicting records

**"DNS records don't match" in Vercel?**

- Wait a bit longer (DNS can be slow)
- Double-check the IP address is exactly `216.198.79.1`
- Make sure there's only ONE A record for `@`

## Quick Checklist

- [ ] Logged into Bluehost cPanel
- [ ] Found DNS Zone Editor
- [ ] Selected risque2.com
- [ ] Deleted old A record for `@`
- [ ] Added new A record: `@` → `216.198.79.1`
- [ ] Added CNAME: `www` → `cname.vercel-dns.com`
- [ ] Saved changes
- [ ] Waiting for DNS propagation (1-2 hours)

## What to Expect

**Immediately after updating:**
- Vercel might still show "Invalid Configuration"
- Bluehost page might still show
- This is normal - DNS needs time

**After 1-2 hours:**
- Vercel should show domain as "Valid"
- Visiting risque2.com should show your website
- DNS propagation complete

**If it's been 24+ hours and still not working:**
- Double-check DNS records
- Contact Bluehost support
- Verify domain is pointing correctly

## Need Help?

If you can't find DNS Zone Editor in Bluehost, let me know and I can help you locate it or provide alternative instructions!
