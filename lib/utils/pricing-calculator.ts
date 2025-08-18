import { prisma } from "../prisma"
import type { PricingRule } from "@prisma/client"

export interface PricingInput {
  serviceId: string
  quantity: number
  sqft?: number
  rooms?: number
  packageId?: string
  couponCode?: string
}

export interface PricingResult {
  basePrice: number
  adjustedPrice: number
  discount: number
  tax: number
  total: number
  appliedRules: string[]
}

export class PricingCalculator {
  async calculatePrice(input: PricingInput): Promise<PricingResult> {
    const service = await prisma.service.findUnique({
      where: { id: input.serviceId },
      include: {
        pricingRules: {
          where: { isActive: true },
          orderBy: { priority: "desc" },
        },
      },
    })

    if (!service) {
      throw new Error("Service not found")
    }

    const basePrice = service.basePrice * input.quantity
    let adjustedPrice = basePrice
    const appliedRules: string[] = []

    // Apply pricing rules
    for (const rule of service.pricingRules) {
      if (this.evaluateCondition(rule, input)) {
        if (rule.modifierType === "MULTIPLIER") {
          adjustedPrice *= rule.modifier
        } else {
          adjustedPrice += rule.modifier
        }
        appliedRules.push(rule.name)
      }
    }

    // Apply package discount
    let discount = 0
    if (input.packageId) {
      const packageData = await prisma.package.findUnique({
        where: { id: input.packageId },
      })
      if (packageData) {
        discount = adjustedPrice * (packageData.discount / 100)
      }
    }

    // Apply coupon
    if (input.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: input.couponCode, isActive: true },
      })

      if (coupon && this.isCouponValid(coupon)) {
        if (coupon.discountType === "PERCENTAGE") {
          const couponDiscount = adjustedPrice * (coupon.discountValue / 100)
          discount += Math.min(couponDiscount, coupon.maxDiscount || couponDiscount)
        } else {
          discount += coupon.discountValue
        }
      }
    }

    const subtotal = Math.max(0, adjustedPrice - discount)
    const tax = subtotal * 0.08 // 8% tax rate
    const total = subtotal + tax

    return {
      basePrice,
      adjustedPrice,
      discount,
      tax,
      total,
      appliedRules,
    }
  }

  private evaluateCondition(rule: PricingRule, input: PricingInput): boolean {
    const condition = rule.condition as any

    // Example condition evaluation
    if (condition.sqft && input.sqft) {
      return input.sqft >= condition.sqft.min && input.sqft <= condition.sqft.max
    }

    if (condition.rooms && input.rooms) {
      return input.rooms >= condition.rooms.min
    }

    return true
  }

  private isCouponValid(coupon: any): boolean {
    const now = new Date()
    return (
      coupon.validFrom <= now &&
      coupon.validUntil >= now &&
      (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit)
    )
  }
}

export const pricingCalculator = new PricingCalculator()
