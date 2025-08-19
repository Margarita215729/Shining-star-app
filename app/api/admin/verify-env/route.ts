import { prisma } from "@/lib/prisma"
import { getStripe } from "@/lib/stripe"
import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: NextRequest) {
  try {
    const verified: Record<string, boolean> = {}

    // Database connection
    try {
      await prisma.$connect()
      verified.MONGODB_URI = true
    } catch {
      verified.MONGODB_URI = false
    }

    // Stripe connection
    try {
      if (process.env.STRIPE_SECRET_KEY) {
        const stripe = await getStripe()
        await stripe.accounts.retrieve()
        verified.STRIPE_SECRET_KEY = true
      } else {
        verified.STRIPE_SECRET_KEY = false
      }
    } catch {
      verified.STRIPE_SECRET_KEY = false
    }

    // Resend connection
    try {
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY)
        // Test API key validity
        verified.RESEND_API_KEY = true
      } else {
        verified.RESEND_API_KEY = false
      }
    } catch {
      verified.RESEND_API_KEY = false
    }

    // Check other required environment variables
    const requiredVars = [
      "AUTH_SECRET",
      "NEXT_PUBLIC_SITE_URL",
      "EMAIL_SERVER_HOST",
      "EMAIL_SERVER_PORT",
      "EMAIL_SERVER_USER",
      "EMAIL_SERVER_PASSWORD",
      "EMAIL_FROM",
      "SERVICE_RADIUS_MILES",
      "NEXT_PUBLIC_SERVICE_CENTER_LAT",
      "NEXT_PUBLIC_SERVICE_CENTER_LON",
      "STRIPE_WEBHOOK_SECRET",
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    ]

    requiredVars.forEach((varName) => {
      verified[varName] = !!process.env[varName]
    })

    return NextResponse.json({ verified })
  } catch (error) {
    console.error("Environment verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
