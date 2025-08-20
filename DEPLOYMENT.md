# Shining Star App - Production Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account with this repository
- MongoDB Atlas cluster
- Stripe account (test or live)
- Resend account for email

### Step 1: One-Click Deploy
Click the button below to deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Margarita215729/Shining-star-app&env=NEXT_PUBLIC_SITE_URL,MONGODB_URI,STRIPE_SECRET_KEY,STRIPE_WEBHOOK_SECRET,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,AUTH_SECRET,RESEND_API_KEY,EMAIL_FROM,SERVICE_RADIUS_MILES,NEXT_PUBLIC_SERVICE_CENTER_LAT,NEXT_PUBLIC_SERVICE_CENTER_LON)

### Step 2: Set Environment Variables

In your Vercel dashboard, add these environment variables:

#### Required Variables
```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
AUTH_SECRET=your-secure-random-string-here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Email
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=noreply@your-domain.com

# Service Area
SERVICE_RADIUS_MILES=25
NEXT_PUBLIC_SERVICE_CENTER_LAT=39.9526
NEXT_PUBLIC_SERVICE_CENTER_LON=-75.1652
```

### Step 3: Post-Deployment Setup

1. **Database Setup**: Visit `/admin/setup` to initialize your database
2. **Stripe Webhooks**: Add webhook endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
3. **Domain Setup**: Configure custom domain in Vercel if needed

## 🔧 Local Development

```bash
# Clone repository
git clone https://github.com/Margarita215729/Shining-star-app.git
cd Shining-star-app

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev
```

## 📊 Features

- **Multi-language Support**: English, Spanish, Russian, Ukrainian, Kazakh
- **Payment Processing**: Stripe integration with deposit system
- **Admin Dashboard**: Comprehensive management interface
- **Customer Portal**: Booking management and history
- **Real-time Chat**: Customer support system
- **Mobile-First Design**: Responsive across all devices
- **SEO Optimized**: Full metadata and sitemap generation

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js with magic links
- **Payments**: Stripe with webhooks
- **Email**: Resend for transactional emails
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel

## 📈 Production Optimizations

- Server-side rendering for SEO
- Image optimization with Next.js
- Bundle optimization and code splitting
- Database connection pooling
- Rate limiting on API routes
- Security headers and CSRF protection

## 🔒 Security Features

- HTTPS enforcement
- Environment variable validation
- Input sanitization
- Rate limiting
- Webhook signature verification
- SQL injection prevention with Prisma

## 📞 Support

For deployment issues or questions, please open an issue on GitHub.