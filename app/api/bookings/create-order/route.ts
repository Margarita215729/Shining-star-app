import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createOrderSchema = z.object({
  services: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().min(1),
      size: z.string().optional(),
      frequency: z.enum(["one-time", "weekly", "bi-weekly", "monthly"]),
      addOns: z.array(z.string()).default([]),
    }),
  ),
  packageId: z.string().optional(),
  customerInfo: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
  }),
  selectedSlot: z.object({
    id: z.string(),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    estimatedDuration: z.number(),
  }),
  geocoding: z.object({
    lat: z.number(),
    lng: z.number(),
    isWithinServiceArea: z.boolean(),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const data = createOrderSchema.parse(body)

    let customer = await prisma.customer.findUnique({
      where: { email: data.customerInfo.email },
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          firstName: data.customerInfo.firstName,
          lastName: data.customerInfo.lastName,
          email: data.customerInfo.email,
          phone: data.customerInfo.phone,
          userId: session?.user?.id,
        },
      })
    }

    const address = await prisma.address.create({
      data: {
        customerId: customer.id,
        street: data.customerInfo.address,
        city: "Philadelphia",
        state: "PA",
        zipCode: "19101", // Default, should be parsed from geocoding
        country: "US",
        latitude: data.geocoding.lat,
        longitude: data.geocoding.lng,
        isDefault: true,
      },
    })

    const services = await prisma.service.findMany({
      where: { id: { in: data.services.map((s) => s.id) } },
      include: { variants: true },
    })

    let subtotal = 0
    const quoteItems = []

    for (const serviceData of data.services) {
      const service = services.find((s) => s.id === serviceData.id)
      if (!service) continue

      const unitPrice = service.basePrice
      let totalPrice = unitPrice * serviceData.quantity

      // Apply size multipliers
      if (serviceData.size && service.variants.length > 0) {
        const variant = service.variants.find((v) => v.name.toLowerCase().includes(serviceData.size))
        if (variant) {
          totalPrice *= variant.priceMultiplier
        }
      }

      // Frequency discounts
      const frequencyMultipliers = {
        "one-time": 1,
        weekly: 0.9,
        "bi-weekly": 0.95,
        monthly: 1,
      }
      totalPrice *= frequencyMultipliers[serviceData.frequency]

      quoteItems.push({
        serviceId: service.id,
        quantity: serviceData.quantity,
        unitPrice,
        totalPrice,
        frequency: serviceData.frequency,
        size: serviceData.size,
      })

      subtotal += totalPrice
    }

    let discount = 0
    let packageData = null
    if (data.packageId) {
      packageData = await prisma.package.findUnique({
        where: { id: data.packageId },
      })
      if (packageData && data.services.length >= packageData.minServices) {
        discount = subtotal * packageData.discountPercentage
      }
    }

    const total = subtotal - discount
    const depositAmount = Math.round(total * 0.25 * 100) / 100 // 25% deposit

    const quote = await prisma.quote.create({
      data: {
        customerId: customer.id,
        subtotal,
        discount,
        total,
        depositAmount,
        packageId: data.packageId,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        items: {
          create: quoteItems,
        },
      },
      include: {
        items: true,
      },
    })

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        quoteId: quote.id,
        addressId: address.id,
        status: "DRAFT",
        subtotal,
        discount,
        total,
        depositAmount,
        depositPaid: false,
        scheduledDate: new Date(data.selectedSlot.date),
        scheduledStartTime: data.selectedSlot.startTime,
        scheduledEndTime: data.selectedSlot.endTime,
        estimatedDuration: data.selectedSlot.estimatedDuration,
        items: {
          create: quoteItems.map((item) => ({
            serviceId: item.serviceId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            frequency: item.frequency,
            size: item.size,
          })),
        },
      },
      include: {
        items: true,
        customer: true,
        address: true,
      },
    })

    return NextResponse.json({
      success: true,
      order,
      quote,
      depositAmount,
    })
  } catch (error) {
    console.error("Order creation failed:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
