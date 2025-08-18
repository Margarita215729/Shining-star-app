"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PaymentForm from "@/components/payment-form"
import { ArrowLeft, CheckCircle, Calendar, MapPin, Clock, User, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function PaymentPage() {
  const t = useTranslations("navigation")
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const orderId = searchParams.get("orderId")
  const amount = searchParams.get("amount")

  useEffect(() => {
    const paymentStatus = searchParams.get("payment")
    if (paymentStatus === "success") {
      setPaymentSuccess(true)
    }

    if (orderId) {
      fetchOrderDetails()
    } else {
      setError("No order ID provided")
      setLoading(false)
    }
  }, [orderId, searchParams])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch order details")
      }
      const orderData = await response.json()
      setOrder(orderData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order")
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)
    // Redirect to bookings page after a delay
    setTimeout(() => {
      router.push("/portal/bookings?success=true")
    }, 3000)
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
    setError(error)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading order details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Link href="/booking" className="mt-4">
          <Button variant="outline">Back to Booking</Button>
        </Link>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="flex flex-col">
        <section className="py-20 bg-gradient-to-br from-green-50 to-primary/5">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">Payment Successful!</h1>
                <p className="text-lg text-muted-foreground">
                  Your deposit has been processed and your booking is confirmed. You'll receive a confirmation email
                  shortly.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Confirmed</CardTitle>
                  <CardDescription>Reference: {order?.id || orderId}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{order?.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString() : "TBD"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{order?.scheduledStartTime || "TBD"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Cleaner TBD</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Philadelphia, PA</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Deposit Paid</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${order?.depositAmount || (amount ? Number(amount) / 100 : 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Remaining Balance</span>
                      <span>${order ? (order.total - order.depositAmount).toFixed(2) : "0.00"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 space-y-3">
                <p className="text-sm text-muted-foreground">Redirecting to your bookings in a few seconds...</p>
                <Link href="/portal/bookings">
                  <Button>View My Bookings</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-6">
              <Link href="/booking">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Booking
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">Complete Your Deposit Payment</h1>
            <p className="text-lg text-muted-foreground">Pay 25% deposit to confirm your booking</p>
          </motion.div>
        </div>
      </section>

      {/* Payment Content */}
      <section className="py-12">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Booking Summary */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                  <CardDescription>Review your cleaning service details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Cleaning Service</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{order?.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString() : "TBD"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{order?.scheduledStartTime || "TBD"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>
                          Duration:{" "}
                          {order?.estimatedDuration
                            ? `${Math.floor(order.estimatedDuration / 60)}h ${order.estimatedDuration % 60}m`
                            : "TBD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>Philadelphia, PA</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${order?.subtotal?.toFixed(2) || "0.00"}</span>
                    </div>
                    {order?.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${order.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span className="text-primary">${order?.total?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between text-sm bg-primary/5 p-2 rounded">
                      <span className="font-medium">Deposit (25%)</span>
                      <span className="font-semibold">
                        ${order?.depositAmount?.toFixed(2) || (amount ? (Number(amount) / 100).toFixed(2) : "0.00")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Remaining Balance</span>
                      <span>${order ? (order.total - order.depositAmount).toFixed(2) : "0.00"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <PaymentForm
                amount={order?.depositAmount || (amount ? Number(amount) / 100 : 0)}
                orderId={orderId || undefined}
                description={`Deposit for cleaning service - ${order?.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString() : "TBD"}`}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
