// Temporary type definitions to replace Prisma types during development

export interface Customer {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role: "CUSTOMER" | "ADMIN" | "CLEANER"
  loyaltyPoints: number
  memberSince: Date
  isActive: boolean
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  addressId: string
  quoteId?: string
  packageId?: string
  status: OrderStatus
  scheduledDate: Date
  scheduledTime: string
  estimatedDuration: number
  actualStartTime?: Date
  actualEndTime?: Date
  subtotal: number
  discount: number
  tax: number
  total: number
  depositAmount: number
  depositPaid: boolean
  depositPaidAt?: Date
  fullyPaid: boolean
  fullyPaidAt?: Date
  paymentStatus: PaymentStatus
  stripePaymentId?: string
  stripePaymentIntentId?: string
  notes?: string
  completionNotes?: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "PAYMENT_FAILED" | "DISPUTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED"

export interface PricingRule {
  id: string
  serviceId: string
  name: string
  condition: any
  modifier: number
  modifierType: "MULTIPLIER" | "FIXED_AMOUNT"
  priority: number
  isActive: boolean
  validFrom?: Date
  validUntil?: Date
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}