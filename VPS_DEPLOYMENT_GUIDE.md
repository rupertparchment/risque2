# Deploying to Bluehost VPS - If You Go That Route

If you decide to go with Bluehost VPS, here's how to deploy:

## Prerequisites

- Bluehost VPS account set up
- SSH access enabled
- Root or sudo access
- Domain pointed to VPS IP

## Step 1: Connect to VPS via SSH

**Get SSH credentials from Bluehost:**
- IP address
- Username (usually `root` or your cPanel username)
- Password or SSH key

**Connect:**
```bash
ssh username@your-vps-ip
```

## Step 2: Install Node.js

**Update system:**
```bash
sudo apt update
sudo apt upgrade -y
```

**Install Node.js 18+ (using NodeSource):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

**Verify:**
```bash
node --version
npm --version
```

## Step 3: Install PostgreSQL (for database)

```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Create database:**
```bash
sudo -u postgres psql
CREATE DATABASE risque;
CREATE USER risque_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE risque TO risque_user;
\q
```

## Step 4: Upload Your Code

**Option A: Using Git (Recommended)**
```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/risque-website.git
cd risque-website
```

**Option B: Using FTP/SFTP**
- Upload files to `/var/www/risque-website` or similar

## Step 5: Install Dependencies

```bash
cd /var/www/risque-website
npm install
```

## Step 6: Set Up Environment Variables

**Create .env file:**
```bash
nano .env
```

**Add:**
```env
DATABASE_URL="postgresql://risque_user:your-password@localhost:5432/risque"
NEXTAUTH_URL="https://risque2.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
ADMIN_EMAIL="admin@risque2.com"
ADMIN_PASSWORD="your-secure-password"
```

## Step 7: Set Up Prisma

```bash
npx prisma generate
npx prisma migrate deploy
```

## Step 8: Build the Application

```bash
npm run build
```

## Step 9: Set Up PM2 (Process Manager)

**Install PM2:**
```bash
npm install -g pm2
```

**Start application:**
```bash
pm2 start server.js --name risque
pm2 save
pm2 startup
```

**PM2 commands:**
```bash
pm2 list          # View running apps
pm2 logs risque   # View logs
pm2 restart risque # Restart app
pm2 stop risque    # Stop app
```

## Step 10: Set Up Nginx (Reverse Proxy)

**Install Nginx:**
```bash
sudo apt install nginx -y
```

**Create Nginx config:**
```bash
sudo nano /etc/nginx/sites-available/risque2.com
```

**Add:**
```nginx
server {
    listen 80;
    server_name risque2.com www.risque2.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/risque2.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 11: Set Up SSL (Let's Encrypt)

**Install Certbot:**
```bash
sudo apt install certbot python3-certbot-nginx -y
```

**Get SSL certificate:**
```bash
sudo certbot --nginx -d risque2.com -d www.risque2.com
```

**Auto-renewal (already set up by certbot):**
```bash
sudo certbot renew --dry-run
```

## Step 12: Configure Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Step 13: Set Up Automatic Updates

**For security:**
```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Monitoring & Maintenance

**Check application status:**
```bash
pm2 status
pm2 logs risque
```

**Check Nginx:**
```bash
sudo systemctl status nginx
```

**Check database:**
```bash
sudo systemctl status postgresql
```

## Troubleshooting

**Application won't start:**
- Check PM2 logs: `pm2 logs risque`
- Check Node.js version: `node --version`
- Check environment variables: `cat .env`

**Can't access website:**
- Check Nginx: `sudo systemctl status nginx`
- Check firewall: `sudo ufw status`
- Check DNS: `dig risque2.com`

**Database connection issues:**
- Check PostgreSQL: `sudo systemctl status postgresql`
- Test connection: `psql -U risque_user -d risque`

## Security Checklist

- [ ] Change default SSH port (optional but recommended)
- [ ] Set up SSH key authentication (disable password auth)
- [ ] Configure firewall (UFW)
- [ ] Set up SSL certificate
- [ ] Keep system updated
- [ ] Use strong passwords
- [ ] Set up backups

## Backup Strategy

**Database backup:**
```bash
pg_dump -U risque_user risque > backup_$(date +%Y%m%d).sql
```

**Application backup:**
```bash
tar -czf app_backup_$(date +%Y%m%d).tar.gz /var/www/risque-website
```

**Set up automated backups** (cron job or Bluehost backup service)

## Cost Considerations

**VPS costs:**
- Monthly hosting: $20-80/month
- Your time for setup/maintenance: Variable
- SSL: Free (Let's Encrypt)
- Backups: May cost extra

**vs Vercel:**
- Hosting: FREE
- Setup: 30 minutes
- Maintenance: Minimal
- SSL: Automatic and free

## Recommendation

**If Bluehost VPS is:**
- Under $40/month + they credit shared hosting → Worth considering
- Over $60/month → Vercel is better value
- You're technical + want control → VPS is good
- You want easy → Vercel is better

Either way works! Get the pricing first, then decide.
