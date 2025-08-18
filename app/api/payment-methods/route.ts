import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { getUserById } from "@/lib/database-operations"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Find Stripe customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    })

    if (customers.data.length === 0) {
      return NextResponse.json({ paymentMethods: [] })
    }

    const customerId = customers.data[0].id

    // Get payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    })

    return NextResponse.json({
      paymentMethods: paymentMethods.data.map((pm) => ({
        id: pm.id,
        type: pm.card?.brand,
        last4: pm.card?.last4,
        expiryMonth: pm.card?.exp_month,
        expiryYear: pm.card?.exp_year,
      })),
    })
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { paymentMethodId } = await request.json()

    if (!paymentMethodId) {
      return NextResponse.json({ error: "Payment method ID required" }, { status: 400 })
    }

    await stripe.paymentMethods.detach(paymentMethodId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting payment method:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
