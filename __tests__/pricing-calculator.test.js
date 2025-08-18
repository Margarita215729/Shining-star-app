import { PricingCalculator } from "../lib/utils/pricing-calculator"
import { prisma } from "../lib/prisma"
import jest from "jest" // Declare the jest variable

// Mock Prisma
jest.mock("../lib/prisma", () => ({
  prisma: {
    service: {
      findUnique: jest.fn(),
    },
    package: {
      findUnique: jest.fn(),
    },
    coupon: {
      findUnique: jest.fn(),
    },
  },
}))

describe("PricingCalculator", () => {
  let calculator

  beforeEach(() => {
    calculator = new PricingCalculator()
    jest.clearAllMocks()
  })

  test("calculates basic service price correctly", async () => {
    const mockService = {
      id: "1",
      basePrice: 50,
      pricingRules: [],
    }

    prisma.service.findUnique.mockResolvedValue(mockService)

    const result = await calculator.calculatePrice({
      serviceId: "1",
      quantity: 2,
    })

    expect(result.basePrice).toBe(100) // 50 * 2
    expect(result.adjustedPrice).toBe(100)
    expect(result.tax).toBe(8) // 8% of 100
    expect(result.total).toBe(108)
  })

  test("applies square footage pricing rules", async () => {
    const mockService = {
      id: "1",
      basePrice: 2, // $2 per sqft
      pricingRules: [
        {
          name: "Large Area Discount",
          condition: { sqft: { min: 2000 } },
          modifier: 0.85,
          modifierType: "MULTIPLIER",
        },
      ],
    }

    prisma.service.findUnique.mockResolvedValue(mockService)

    const result = await calculator.calculatePrice({
      serviceId: "1",
      quantity: 1,
      sqft: 2500,
    })

    expect(result.basePrice).toBe(2)
    expect(result.adjustedPrice).toBe(1.7) // 2 * 0.85
    expect(result.appliedRules).toContain("Large Area Discount")
  })

  test("applies package discount", async () => {
    const mockService = {
      id: "1",
      basePrice: 100,
      pricingRules: [],
    }

    const mockPackage = {
      id: "pkg1",
      discount: 15, // 15%
    }

    prisma.service.findUnique.mockResolvedValue(mockService)
    prisma.package.findUnique.mockResolvedValue(mockPackage)

    const result = await calculator.calculatePrice({
      serviceId: "1",
      quantity: 1,
      packageId: "pkg1",
    })

    expect(result.discount).toBe(15) // 15% of 100
    expect(result.total).toBe(91.8) // (100 - 15) * 1.08
  })

  test("applies coupon discount", async () => {
    const mockService = {
      id: "1",
      basePrice: 100,
      pricingRules: [],
    }

    const mockCoupon = {
      code: "TEST20",
      discountType: "PERCENTAGE",
      discountValue: 20,
      maxDiscount: 50,
      validFrom: new Date(Date.now() - 86400000), // yesterday
      validUntil: new Date(Date.now() + 86400000), // tomorrow
      usageLimit: null,
      usedCount: 0,
    }

    prisma.service.findUnique.mockResolvedValue(mockService)
    prisma.coupon.findUnique.mockResolvedValue(mockCoupon)

    const result = await calculator.calculatePrice({
      serviceId: "1",
      quantity: 1,
      couponCode: "TEST20",
    })

    expect(result.discount).toBe(20) // 20% of 100
    expect(result.total).toBe(86.4) // (100 - 20) * 1.08
  })
})
