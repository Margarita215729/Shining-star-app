import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, currency = "usd", orderId, description, isDeposit = false } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const stripe = getStripe()

    let order = null
    if (orderId) {
      order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { customer: true },
      })

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }
    }

    let customerEmail = session.user.email
    let customerName = session.user.name || ""

    if (order?.customer) {
      customerEmail = order.customer.email
      customerName = `${order.customer.firstName} ${order.customer.lastName}`
    }

    // Create or retrieve Stripe customer
    let customerId: string
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id
    } else {
      const customer = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
        metadata: {
          userId: session.user.id,
          ...(order?.customer?.id && { customerId: order.customer.id }),
        },
      })
      customerId = customer.id
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      description: description || "Shining Star Cleaning Service",
      metadata: {
        userId: session.user.id,
        orderId: orderId || "",
        isDeposit: isDeposit.toString(),
        ...(order && {
          customerId: order.customerId,
          totalAmount: Math.round(order.total * 100).toString(),
          depositAmount: Math.round(order.depositAmount * 100).toString(),
        }),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
