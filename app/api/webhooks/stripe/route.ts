import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")!
    const stripe = await getStripe()

    let event: any

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const eventId = event.id

    // Check if we've already processed this event
    const existingEvent = await prisma.auditLog.findUnique({
      where: { stripeEventId: eventId },
    })

    if (existingEvent) {
      console.log(`Event ${eventId} already processed`)
      return NextResponse.json({ received: true })
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object, eventId)
        break

      case "payment_intent.payment_failed":
        await handlePaymentFailure(event.data.object, eventId)
        break

      case "charge.dispute.created":
        await handleDispute(event.data.object, eventId)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handlePaymentSuccess(paymentIntent: any, eventId: string) {
  try {
    const { metadata } = paymentIntent
    const { orderId, isDeposit, customerId } = metadata

    if (orderId) {
      const isDepositPayment = isDeposit === "true"

      const updateData: any = {
        status: isDepositPayment ? "CONFIRMED" : "PAID",
        stripePaymentIntentId: paymentIntent.id,
      }

      if (isDepositPayment) {
        updateData.depositPaid = true
        updateData.depositPaidAt = new Date()
      } else {
        updateData.fullyPaid = true
        updateData.fullyPaidAt = new Date()
      }

      await prisma.order.update({
        where: { id: orderId },
        data: updateData,
      })

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { customer: true, items: true },
      })

      if (order) {
        const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

        await prisma.invoice.create({
          data: {
            invoiceNumber,
            customerId: order.customerId,
            orderId: order.id,
            status: "PAID",
            issueDate: new Date(),
            dueDate: new Date(),
            paidDate: new Date(),
            subtotal: paymentIntent.amount / 100,
            tax: 0,
            discount: 0,
            total: paymentIntent.amount / 100,
            paymentMethod: `${paymentIntent.charges.data[0]?.payment_method_details?.card?.brand} ****${paymentIntent.charges.data[0]?.payment_method_details?.card?.last4}`,
            stripePaymentIntentId: paymentIntent.id,
            isDeposit: isDepositPayment,
          },
        })

        if (isDepositPayment) {
          const remainingAmount = order.total - order.depositAmount
          const remainingInvoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now() + 1).slice(-6)}`

          await prisma.invoice.create({
            data: {
              invoiceNumber: remainingInvoiceNumber,
              customerId: order.customerId,
              orderId: order.id,
              status: "PENDING",
              issueDate: new Date(),
              dueDate: new Date(order.scheduledDate),
              subtotal: remainingAmount,
              tax: 0,
              discount: 0,
              total: remainingAmount,
              isDeposit: false,
            },
          })
        }
      }

      console.log(`Payment successful for order ${orderId}, deposit: ${isDepositPayment}`)
    }

    await prisma.auditLog.create({
      data: {
        action: "PAYMENT_SUCCESS",
        entityType: "ORDER",
        entityId: orderId,
        details: `Payment of $${paymentIntent.amount / 100} processed successfully`,
        stripeEventId: eventId,
        createdAt: new Date(),
      },
    })
  } catch (error) {
    console.error("Error handling payment success:", error)
    await prisma.auditLog
      .create({
        data: {
          action: "PAYMENT_ERROR",
          entityType: "ORDER",
          entityId: paymentIntent.metadata.orderId,
          details: `Payment processing failed: ${error}`,
          stripeEventId: eventId,
          createdAt: new Date(),
        },
      })
      .catch(console.error)
  }
}

async function handlePaymentFailure(paymentIntent: any, eventId: string) {
  try {
    const { metadata } = paymentIntent
    const { orderId } = metadata

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAYMENT_FAILED",
          stripePaymentIntentId: paymentIntent.id,
        },
      })

      console.log(`Payment failed for order ${orderId}`)
    }

    await prisma.auditLog.create({
      data: {
        action: "PAYMENT_FAILED",
        entityType: "ORDER",
        entityId: orderId,
        details: `Payment failed: ${paymentIntent.last_payment_error?.message || "Unknown error"}`,
        stripeEventId: eventId,
        createdAt: new Date(),
      },
    })
  } catch (error) {
    console.error("Error handling payment failure:", error)
  }
}

async function handleDispute(dispute: any, eventId: string) {
  try {
    const stripe = await getStripe()
    const charge = await stripe.charges.retrieve(dispute.charge)
    const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent as string)
    const { orderId } = paymentIntent.metadata

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "DISPUTED",
        },
      })
    }

    await prisma.auditLog.create({
      data: {
        action: "PAYMENT_DISPUTED",
        entityType: "ORDER",
        entityId: orderId,
        details: `Payment disputed: ${dispute.reason}`,
        stripeEventId: eventId,
        createdAt: new Date(),
      },
    })
  } catch (error) {
    console.error("Error handling dispute:", error)
  }
}
