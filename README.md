# Risqué Club Website

A modern, full-featured website for Risqué lifestyle club built with Next.js, TypeScript, and Prisma.

## Features

- ✅ Membership signup with Stripe payment processing
- ✅ Event calendar with database integration
- ✅ Admin panel for managing events and flyers
- ✅ Photo gallery for interior photos
- ✅ Mobile-responsive design
- ✅ Secure authentication

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (via Prisma) - can be upgraded to PostgreSQL
- **Styling**: Tailwind CSS
- **Payment**: Stripe
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form + Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your:
   - Stripe API keys (get from https://stripe.com)
   - NextAuth secret (generate with: `openssl rand -base64 32`)
   - Admin credentials

3. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) (for development)
   
   Production site: [https://risque2.com](https://risque2.com)

## Project Structure

```
risque-website/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── admin/         # Admin API endpoints
│   │   ├── membership/    # Membership signup
│   │   └── webhooks/      # Stripe webhooks
│   ├── admin/             # Admin pages
│   ├── events/             # Event pages
│   ├── gallery/            # Gallery page
│   ├── membership/         # Membership pages
│   └── page.tsx            # Homepage
├── components/             # React components
├── prisma/                 # Database schema
│   └── schema.prisma      # Prisma schema
└── public/                 # Static assets
```

## Key Features

### Membership System
- User registration with email/password
- Stripe integration for payment processing
- Membership status tracking (pending, active, expired)
- Member login portal

### Event Management
- Create, edit, and delete events
- Upload flyer images for themed events
- Set capacity and pricing
- Event calendar display
- RSVP system (can be added)

### Admin Panel
- Secure admin login
- Manage events and flyers
- Upload gallery images
- View members

### Gallery
- Display interior photos
- Categorized images
- Admin upload functionality

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Add them to your `.env` file:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. Set up webhook endpoint:
   - In Stripe Dashboard → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`

## Database

The project uses SQLite by default (good for development). For production, switch to PostgreSQL:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/risque"
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS
- DigitalOcean

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="https://risque2.com"
NEXTAUTH_SECRET="your-secret-key"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Admin (for simple auth - consider upgrading)
ADMIN_EMAIL="admin@risque2.com"
ADMIN_PASSWORD="secure-password"
```

## Admin Access

Default admin credentials are set in `.env`. For production:
- Use proper authentication (NextAuth with credentials provider)
- Implement role-based access control
- Use secure password hashing

## Support

For issues or questions, please contact the development team.

## License

Private - All rights reserved
