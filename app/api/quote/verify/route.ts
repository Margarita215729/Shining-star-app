import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { services, packageId, clientQuote } = await request.json()

    const serviceCategories = [
      {
        id: "bathroom",
        services: [
          { id: "toilet", basePrice: 15 },
          { id: "bath", basePrice: 25 },
          { id: "bathroom-floor", basePrice: 20 },
        ],
      },
      {
        id: "general",
        services: [
          { id: "dust", basePrice: 30 },
          { id: "textile-furniture", basePrice: 40 },
          { id: "wall-stains", basePrice: 35 },
        ],
      },
      {
        id: "windows-floors",
        services: [
          { id: "windows", basePrice: 8 },
          { id: "floor-cleaning", basePrice: 2 },
          { id: "wall-cleaning", basePrice: 1.5 },
        ],
      },
    ]

    const packages = [
      { id: "basic", discount: 0.1, minServices: 3 },
      { id: "premium", discount: 0.2, minServices: 6 },
      { id: "deep", discount: 0.25, minServices: 8 },
    ]

    const windowSizes = [
      { id: "small", multiplier: 1 },
      { id: "medium", multiplier: 1.5 },
      { id: "large", multiplier: 2 },
    ]

    let subtotal = 0
    const lineItems: any[] = []

    services.forEach((service: any) => {
      const serviceData = serviceCategories.flatMap((cat) => cat.services).find((s) => s.id === service.id)

      if (serviceData) {
        let price = serviceData.basePrice * service.quantity

        // Apply size multipliers
        if (service.size) {
          const sizeMultiplier = windowSizes.find((s) => s.id === service.size)?.multiplier || 1
          price *= sizeMultiplier
        }

        // Frequency multipliers
        const frequencyMultipliers = {
          "one-time": 1,
          weekly: 0.9,
          "bi-weekly": 0.95,
          monthly: 1,
        }
        price *= frequencyMultipliers[service.frequency as keyof typeof frequencyMultipliers] || 1

        lineItems.push({
          id: service.id,
          name: serviceData.id,
          quantity: service.quantity,
          unitPrice: serviceData.basePrice,
          totalPrice: price,
          frequency: service.frequency,
        })

        subtotal += price
      }
    })

    // Apply package discount
    let discount = 0
    const selectedPkg = packages.find((p) => p.id === packageId)
    if (selectedPkg && services.length >= selectedPkg.minServices) {
      discount = subtotal * selectedPkg.discount
    }

    const afterDiscount = subtotal - discount
    const deposit = afterDiscount * 0.25
    const total = afterDiscount

    const serverQuote = { subtotal, discount, deposit, total, lineItems }

    return NextResponse.json({
      ...serverQuote,
      verified: Math.abs(serverQuote.total - clientQuote.total) < 0.01,
    })
  } catch (error) {
    console.error("Quote verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
