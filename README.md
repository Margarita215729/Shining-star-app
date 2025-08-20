# Shining Star Cleaning Services

A production-grade Next.js application for professional cleaning services in Philadelphia, featuring full internationalization support for English, Spanish, Russian, Ukrainian, and Kazakh languages.

## Features

- 🌍 **Multi-language Support**: Full i18n with 5 locales (en, es, ru, uk, kk)
- 🎨 **Modern Design System**: Accessible, mobile-first design with AA contrast
- 🔒 **Authentication**: Secure user authentication with NextAuth.js v5 and magic links
- 💳 **Payment Processing**: Stripe integration with 25% deposit system
- 📧 **Email Service**: Resend integration for notifications and magic links
- 🗄️ **Database**: MongoDB with Prisma ORM for type-safe operations
- 📱 **Responsive**: Mobile-first design with Tailwind CSS v4
- ♿ **Accessible**: WCAG AA compliant with focus states and screen reader support
- 🎭 **Animations**: Framer Motion with motion-safe variants for accessibility
- 🛡️ **Security**: Rate limiting, honeypot protection, and secure webhooks
- 📊 **Admin Dashboard**: Comprehensive management with scheduler and notifications
- 💬 **Real-time Chat**: Customer support with Server-Sent Events
- 🌐 **SEO Optimized**: JSON-LD schema, sitemap, and OpenGraph images
- 📸 **Portfolio Management**: Before/after galleries with admin upload interface
- 📦 **Service Packages**: Bundled services with automatic discounts
- 🧹 **Service Catalog**: Detailed cleaning services with pricing calculator

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui with enhanced animations
- **Internationalization**: next-intl
- **Animation**: Framer Motion with accessibility support
- **Authentication**: NextAuth.js v5 with magic links
- **Database**: MongoDB with Prisma ORM
- **Payments**: Stripe with webhook handling
- **Email**: Resend for transactional emails
- **Deployment**: Vercel with CI/CD pipeline

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (Atlas recommended)
- Stripe account (test and live keys)
- Resend account for email delivery

### Local Development

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd shining-star-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   
   Copy the example environment file and fill in your values:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

   See the [Environment Variables](#environment-variables) section below for detailed setup instructions.

4. **Initialize the database**
   \`\`\`bash
   npx prisma db push
   npm run db:seed
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Setup Wizard

After deployment, visit `/admin/setup` to configure your environment variables with our interactive setup wizard that verifies all connections.

## One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/shining-star-app&env=NEXT_PUBLIC_SITE_URL,MONGODB_URI,STRIPE_SECRET_KEY,STRIPE_WEBHOOK_SECRET,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,AUTH_SECRET,RESEND_API_KEY,EMAIL_SERVER_HOST,EMAIL_SERVER_PORT,EMAIL_SERVER_USER,EMAIL_SERVER_PASSWORD,EMAIL_FROM,SERVICE_RADIUS_MILES,NEXT_PUBLIC_SERVICE_CENTER_LAT,NEXT_PUBLIC_SERVICE_CENTER_LON)

## Environment Variables

### Required Variables

| Variable | Description | How to Obtain | Example |
|----------|-------------|---------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Your site's public URL | Use your domain or Vercel URL | `https://shiningstarphilly.com` |
| `MONGODB_URI` | MongoDB connection string | [MongoDB Atlas](https://mongodb.com) → Create cluster → Connect | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `STRIPE_SECRET_KEY` | Stripe secret key | [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API keys | `sk_test_...` or `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Stripe → Developers → Webhooks → Create endpoint | `whsec_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Stripe Dashboard → API keys → Publishable key | `pk_test_...` or `pk_live_...` |
| `AUTH_SECRET` | NextAuth.js secret | Generate: `openssl rand -base64 32` | `your-super-secret-32-char-string` |
| `RESEND_API_KEY` | Resend API key | [Resend](https://resend.com) → API Keys → Create | `re_...` |
| `EMAIL_SERVER_HOST` | SMTP server host | Your email provider's SMTP settings | `smtp.resend.com` |
| `EMAIL_SERVER_PORT` | SMTP server port | Usually 587 for TLS or 465 for SSL | `587` |
| `EMAIL_SERVER_USER` | SMTP username | From your email provider | `resend` |
| `EMAIL_SERVER_PASSWORD` | SMTP password | Your Resend API key for SMTP | `re_...` |
| `EMAIL_FROM` | From email address | Verified domain in Resend | `noreply@yourdomain.com` |
| `SERVICE_RADIUS_MILES` | Service area radius | Set based on your coverage area | `10` |
| `NEXT_PUBLIC_SERVICE_CENTER_LAT` | Service center latitude | Google Maps → Right-click → Coordinates | `39.9526` |
| `NEXT_PUBLIC_SERVICE_CENTER_LON` | Service center longitude | Google Maps → Right-click → Coordinates | `-75.1652` |

### Detailed Setup Instructions

#### MongoDB Atlas Setup
1. Create account at [mongodb.com](https://mongodb.com)
2. Create new cluster (free tier available)
3. Create database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string from "Connect" button
6. Replace `<password>` with your actual password

#### Stripe Setup
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. For webhooks:
   - Go to Developers → Webhooks
   - Create endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy signing secret

#### Resend Setup
1. Create account at [resend.com](https://resend.com)
2. Verify your domain for sending emails
3. Create API key with send permissions
4. Use API key for both `RESEND_API_KEY` and `EMAIL_SERVER_PASSWORD`

## Project Structure

\`\`\`
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── admin/         # Admin dashboard and setup
│   │   ├── auth/          # Authentication pages
│   │   ├── booking/       # Service builder and payment
│   │   ├── portal/        # Customer portal
│   │   └── ...            # Other pages
│   ├── api/               # API routes
│   │   ├── admin/         # Admin operations
│   │   ├── auth/          # NextAuth.js
│   │   ├── webhooks/      # Stripe webhooks
│   │   └── ...            # Other endpoints
│   └── globals.css        # Global styles with motion-safe
├── components/            # Reusable components
│   ├── ui/               # Enhanced shadcn/ui components
│   ├── admin/            # Admin-specific components
│   └── ...               # Custom components
├── i18n/                 # Internationalization config
├── lib/                  # Utility functions
│   ├── repositories/     # Database operations
│   ├── utils/           # Helper functions
│   └── ...              # Other utilities
├── messages/             # Translation files (en, es, ru, uk, kk)
├── prisma/              # Database schema and migrations
├── scripts/             # Database seeding scripts
└── public/              # Static assets
\`\`\`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with demo data
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Import to Vercel**: Go to [vercel.com](https://vercel.com) and import your repo
3. **Set Environment Variables**: Add all required variables in Vercel dashboard
4. **Deploy**: Vercel will automatically build and deploy

### Environment Variable Verification

The app includes a setup wizard at `/admin/setup` that:
- Verifies all environment variables are set
- Tests database connections
- Validates API keys
- Provides setup instructions for each service

### CI/CD Pipeline

The included GitHub Actions workflow:
- Checks all required environment variables
- Runs linting and type checking
- Executes tests
- Builds the application
- Deploys to Vercel on main branch

## Troubleshooting

### Portfolio and Service Packages

**Portfolio Management**
- Admin can upload before/after photos through `/admin/portfolio`
- Portfolio items support categories, tags, and project dates
- Public portfolio view at `/portfolio` with filtering
- Images should be optimized for web (max 2MB recommended)

**Service Packages**
- Pre-configured service bundles with automatic discounts
- Managed through the admin interface
- Automatically calculated pricing based on included services
- Can be used in the booking flow alongside individual services

### Common Issues

**Build Fails with Missing Environment Variables**
- Ensure all required variables are set in your deployment environment
- Use the setup wizard to verify configuration
- Check the CI logs for specific missing variables

**Database Connection Issues**
- Verify MongoDB URI format and credentials
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

**Stripe Webhook Failures**
- Verify webhook endpoint URL is correct
- Check webhook signing secret matches
- Ensure webhook events are properly configured

**Email Delivery Problems**
- Verify domain is added and verified in Resend
- Check SMTP credentials and settings
- Ensure FROM address uses verified domain

**Service Area Not Working**
- Verify latitude/longitude coordinates are correct
- Check service radius is set appropriately
- Ensure geocoding API is accessible

### Performance Optimization

- Images are optimized with Next.js Image component
- Animations respect `prefers-reduced-motion`
- Database queries use proper indexing
- API routes include rate limiting
- Static assets are cached appropriately

### Accessibility Features

- WCAG AA compliant color contrast
- Keyboard navigation support
- Screen reader compatibility
- Focus management in modals
- Motion-safe animations
- Proper ARIA labels and roles

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@shiningstarphilly.com or create an issue in this repository.

---

**Built with ❤️ for professional cleaning services**
