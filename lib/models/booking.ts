import type { ObjectId } from "mongodb"

export interface Booking {
  _id?: ObjectId
  userId: ObjectId
  serviceId: ObjectId
  cleanerId?: ObjectId
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
  scheduledDate: Date
  scheduledTime: string
  duration: number // in minutes
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    instructions?: string
  }
  pricing: {
    basePrice: number
    addOns: Array<{
      name: string
      price: number
    }>
    discount: number
    tax: number
    total: number
  }
  notes?: string
  specialRequests?: string[]
  estimatedDuration: string
  actualStartTime?: Date
  actualEndTime?: Date
  completionNotes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  _id?: ObjectId
  name: string
  description: string
  category: "residential" | "commercial" | "specialized"
  basePrice: number
  duration: number // in minutes
  features: string[]
  addOns: Array<{
    name: string
    description: string
    price: number
  }>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
