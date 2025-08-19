import Stripe from "stripe"

// Conditional Stripe initialization for build-time safety
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-07-30.basil",
      typescript: true,
    })
  : null

// Runtime validation function
export const getStripe = () => {
  if (!stripe) {
    throw new Error('Missing required environment variable: "STRIPE_SECRET_KEY"')
  }
  return stripe
}

export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100) // Convert to cents
}

export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100 // Convert from cents
}
