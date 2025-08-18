import type { ObjectId } from "mongodb"

export interface Invoice {
  _id?: ObjectId
  invoiceNumber: string
  userId: ObjectId
  bookingId: ObjectId
  status: "pending" | "paid" | "overdue" | "cancelled"
  issueDate: Date
  dueDate: Date
  paidDate?: Date
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod?: string
  stripePaymentIntentId?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  _id?: ObjectId
  userId: ObjectId
  bookingId: ObjectId
  cleanerId: ObjectId
  rating: number // 1-5
  title?: string
  comment?: string
  categories: {
    quality: number
    punctuality: number
    professionalism: number
    communication: number
  }
  isPublic: boolean
  response?: {
    message: string
    respondedBy: ObjectId
    respondedAt: Date
  }
  createdAt: Date
  updatedAt: Date
}
