# Domain Setup Summary - risque2.com

## ✅ Updates Completed

All website files have been updated to use your new domain **risque2.com**:

- ✅ Footer email updated to `info@risque2.com`
- ✅ Contact page email updated to `info@risque2.com`
- ✅ Environment variables updated for `risque2.com`
- ✅ Metadata updated with domain information
- ✅ All documentation updated

## 📋 Next Steps

### 1. Set Up Email (Optional but Recommended)

You can set up email forwarding in Bluehost:
- Forward `info@risque2.com` to your personal email
- Or create a full email account in Bluehost cPanel

### 2. Deploy the Website

**Important:** Bluehost shared hosting typically doesn't support Next.js. See `BLUEHOST_DEPLOYMENT.md` for options:

**Recommended:** Deploy to Vercel (free) and point your Bluehost domain to it:
- Easier than configuring Bluehost
- Built specifically for Next.js
- Free SSL certificate
- Automatic deployments

### 3. Environment Variables for Production

When deploying, make sure to set:
```env
NEXTAUTH_URL="https://risque2.com"
ADMIN_EMAIL="admin@risque2.com"
```

### 4. Update Stripe Webhook

In Stripe Dashboard:
- Webhook URL: `https://risque2.com/api/webhooks/stripe`
- Event: `checkout.session.completed`

## 📁 Files Updated

- `components/Footer.tsx` - Email address
- `app/contact/page.tsx` - Email address  
- `app/layout.tsx` - Metadata with domain
- `env.example` - Production URLs
- `README.md` - Domain references
- `SETUP_GUIDE.md` - Domain references
- `BLUEHOST_DEPLOYMENT.md` - New deployment guide

## 🌐 Your Website

Once deployed, your website will be live at:
- **Main site**: https://risque2.com
- **Admin panel**: https://risque2.com/admin
- **Membership**: https://risque2.com/membership
- **Events**: https://risque2.com/events

## ⚠️ Important Notes

1. **Bluehost & Next.js**: Standard Bluehost hosting may not support Next.js. Consider Vercel for deployment.

2. **Database**: For production, switch from SQLite to PostgreSQL (see deployment guide).

3. **Stripe**: Use test keys for development, live keys for production.

4. **SSL**: Make sure SSL certificate is enabled (Vercel does this automatically).

## 📞 Need Help?

Check these files:
- `BLUEHOST_DEPLOYMENT.md` - Deployment instructions
- `SETUP_GUIDE.md` - Local development setup
- `README.md` - Full documentation
