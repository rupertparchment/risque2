# Email Setup Options for risque2.com

## Option 1: Bluehost Email (If Available)

**If Bluehost allows email without website hosting:**

1. **Log into Bluehost cPanel**
2. **Go to "Email Accounts"**
3. **Create accounts:**
   - info@risque2.com
   - admin@risque2.com
   - contact@risque2.com (optional)
4. **Set passwords**
5. **Access via:**
   - Webmail: webmail.risque2.com
   - Or forward to your personal email

**Cost:** Usually included with domain

## Option 2: Zoho Mail (FREE - Recommended)

**Best free option:**

1. **Sign up:** https://www.zoho.com/mail
2. **Choose "Free" plan**
3. **Add domain:** risque2.com
4. **Verify domain** (add DNS records in Bluehost)
5. **Create email accounts:**
   - info@risque2.com
   - admin@risque2.com
   - Up to 5 users FREE

**Features:**
- ✅ Free for up to 5 users
- ✅ 5GB storage per user
- ✅ Webmail interface
- ✅ Mobile apps
- ✅ Professional email addresses

**Cost:** FREE

## Option 3: Google Workspace

**Most professional option:**

1. **Sign up:** https://workspace.google.com
2. **Choose "Starter" plan**
3. **Add domain:** risque2.com
4. **Verify domain** (add DNS records)
5. **Create email accounts**

**Features:**
- ✅ Gmail interface
- ✅ 30GB storage
- ✅ Google Drive, Calendar, etc.
- ✅ Most reliable

**Cost:** $6/month per user

## Option 4: Microsoft 365

**Good alternative:**

1. **Sign up:** https://www.microsoft.com/microsoft-365
2. **Choose "Business Basic"**
3. **Add domain:** risque2.com
4. **Verify domain**
5. **Create email accounts**

**Features:**
- ✅ Outlook interface
- ✅ 50GB storage
- ✅ Office apps online

**Cost:** $6/month per user

## DNS Records Needed (For External Email)

**If using Zoho/Google/Microsoft, add these DNS records in Bluehost:**

### Zoho Mail:
```
MX Record: mx.zoho.com (Priority: 10)
MX Record: mx2.zoho.com (Priority: 20)
TXT Record: (for verification)
```

### Google Workspace:
```
MX Record: aspmx.l.google.com (Priority: 1)
MX Record: alt1.aspmx.l.google.com (Priority: 5)
MX Record: alt2.aspmx.l.google.com (Priority: 5)
MX Record: alt3.aspmx.l.google.com (Priority: 10)
MX Record: alt4.aspmx.l.google.com (Priority: 10)
TXT Record: (for verification)
```

## My Recommendation

**Start with Zoho Mail (FREE):**
- ✅ Free for 5 users
- ✅ Professional email addresses
- ✅ Good enough for starting
- ✅ Can upgrade later if needed

**If you need more:**
- Upgrade to Google Workspace ($6/month)
- Or use Bluehost email if available

## Quick Setup Guide

### Zoho Mail Setup (5 minutes):

1. Go to: https://www.zoho.com/mail
2. Click "Sign Up Now"
3. Choose "Free" plan
4. Enter domain: risque2.com
5. Verify domain (add DNS records in Bluehost)
6. Create email accounts
7. Done!

**Total cost: $0**

## Summary

**SSL:** ✅ Vercel provides FREE  
**Email:** 
- Try Bluehost first (might be free)
- If not, use Zoho Mail (FREE)
- Or Google Workspace ($6/month)

**You're covered!**
