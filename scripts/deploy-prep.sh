#!/bin/bash

# Deployment preparation script for Shining Star App
# This script prepares the application for Vercel deployment

echo "🚀 Preparing Shining Star App for deployment..."

# Check if environment variables are set
if [ -z "$MONGODB_URI" ]; then
    echo "⚠️  Warning: MONGODB_URI not set"
fi

if [ -z "$AUTH_SECRET" ]; then
    echo "⚠️  Warning: AUTH_SECRET not set"
fi

if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "⚠️  Warning: STRIPE_SECRET_KEY not set"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate || echo "⚠️  Prisma generation failed - using development mode"

# Build the application
echo "🔨 Building application..."
npm run build:dev

echo "✅ Deployment preparation complete!"
echo ""
echo "🌐 Deploy to Vercel:"
echo "   1. Push your code to GitHub"
echo "   2. Import to Vercel from GitHub"
echo "   3. Set environment variables in Vercel dashboard"
echo "   4. Deploy!"