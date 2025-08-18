import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required environment variable: "STRIPE_SECRET_KEY"')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  typescript: true,
})

export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100) // Convert to cents
}

export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100 // Convert from cents
}
