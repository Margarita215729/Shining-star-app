import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  specialInstructions?: string
  role: "customer" | "admin" | "cleaner"
  loyaltyPoints: number
  memberSince: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  _id?: ObjectId
  userId: ObjectId
  preferences: {
    ecoFriendly: boolean
    petFriendly: boolean
    notifications: {
      email: boolean
      sms: boolean
      reminders: boolean
    }
  }
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  createdAt: Date
  updatedAt: Date
}
