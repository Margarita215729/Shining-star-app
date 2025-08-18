"use client"

import type React from "react"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Shield } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  amount: number
  orderId?: string
  description?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

function CheckoutForm({ amount, orderId, description, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          orderId,
          description,
          isDeposit: true,
        }),
      })

      const { clientSecret, error: apiError } = await response.json()

      if (apiError) {
        throw new Error(apiError)
      }

      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/booking/confirmation?orderId=${orderId}`,
        },
        redirect: "if_required",
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      onSuccess?.()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment failed"
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <h3 className="font-semibold">Payment Amount</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="text-2xl font-bold text-primary">${amount}</div>
        </div>

        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      <Button type="submit" disabled={!stripe || isLoading} className="w-full" size="lg">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay ${amount}
          </>
        )}
      </Button>
    </form>
  )
}

export default function PaymentForm(props: PaymentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
        <CardDescription>Complete your payment to confirm your booking</CardDescription>
      </CardHeader>
      <CardContent>
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            currency: "usd",
            appearance: {
              theme: "stripe",
            },
          }}
        >
          <CheckoutForm {...props} />
        </Elements>
      </CardContent>
    </Card>
  )
}
