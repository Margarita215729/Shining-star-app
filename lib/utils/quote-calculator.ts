export interface Service {
  id: string
  quantity: number
  size?: string
  frequency: "one-time" | "weekly" | "bi-weekly" | "monthly"
  addOns: string[]
}

export interface QuoteResult {
  subtotal: number
  discount: number
  deposit: number
  total: number
  lineItems: LineItem[]
}

export interface LineItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
  frequency: string
}

export const calculateServicePrice = (service: Service, basePrice: number, hasSizes = false): number => {
  let price = basePrice * service.quantity

  // Apply size multipliers for services that support it
  if (service.size && hasSizes) {
    const sizeMultipliers = {
      small: 1,
      medium: 1.5,
      large: 2,
    }
    price *= sizeMultipliers[service.size as keyof typeof sizeMultipliers] || 1
  }

  // Apply frequency discounts
  const frequencyMultipliers = {
    "one-time": 1,
    weekly: 0.9, // 10% discount
    "bi-weekly": 0.95, // 5% discount
    monthly: 1,
  }
  price *= frequencyMultipliers[service.frequency]

  return price
}

export const calculatePackageDiscount = (subtotal: number, serviceCount: number, packageId: string): number => {
  const packages = {
    basic: { discount: 0.1, minServices: 3 },
    premium: { discount: 0.2, minServices: 6 },
    deep: { discount: 0.25, minServices: 8 },
  }

  const pkg = packages[packageId as keyof typeof packages]
  if (pkg && serviceCount >= pkg.minServices) {
    return subtotal * pkg.discount
  }

  return 0
}
