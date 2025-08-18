import { getDatabase } from "./mongodb"
import type { User } from "./models/user"
import type { Booking, Service } from "./models/booking"
import type { Invoice, Review } from "./models/invoice"
import { ObjectId } from "mongodb"

// User Operations
export async function createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<ObjectId> {
  const db = await getDatabase()
  const now = new Date()

  const user: User = {
    ...userData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection<User>("users").insertOne(user)
  return result.insertedId
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase()
  return await db.collection<User>("users").findOne({ email })
}

export async function getUserById(id: string | ObjectId): Promise<User | null> {
  const db = await getDatabase()
  const objectId = typeof id === "string" ? new ObjectId(id) : id
  return await db.collection<User>("users").findOne({ _id: objectId })
}

export async function updateUser(id: string | ObjectId, updates: Partial<User>): Promise<boolean> {
  const db = await getDatabase()
  const objectId = typeof id === "string" ? new ObjectId(id) : id

  const result = await db.collection<User>("users").updateOne(
    { _id: objectId },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
  )

  return result.modifiedCount > 0
}

// Booking Operations
export async function createBooking(bookingData: Omit<Booking, "_id" | "createdAt" | "updatedAt">): Promise<ObjectId> {
  const db = await getDatabase()
  const now = new Date()

  const booking: Booking = {
    ...bookingData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection<Booking>("bookings").insertOne(booking)
  return result.insertedId
}

export async function getUserBookings(userId: string | ObjectId, status?: string): Promise<Booking[]> {
  const db = await getDatabase()
  const objectId = typeof userId === "string" ? new ObjectId(userId) : userId

  const filter: any = { userId: objectId }
  if (status) {
    filter.status = status
  }

  return await db.collection<Booking>("bookings").find(filter).sort({ scheduledDate: -1 }).toArray()
}

export async function updateBooking(id: string | ObjectId, updates: Partial<Booking>): Promise<boolean> {
  const db = await getDatabase()
  const objectId = typeof id === "string" ? new ObjectId(id) : id

  const result = await db.collection<Booking>("bookings").updateOne(
    { _id: objectId },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
  )

  return result.modifiedCount > 0
}

// Service Operations
export async function getServices(category?: string): Promise<Service[]> {
  const db = await getDatabase()

  const filter: any = { isActive: true }
  if (category) {
    filter.category = category
  }

  return await db.collection<Service>("services").find(filter).sort({ name: 1 }).toArray()
}

export async function getServiceById(id: string | ObjectId): Promise<Service | null> {
  const db = await getDatabase()
  const objectId = typeof id === "string" ? new ObjectId(id) : id
  return await db.collection<Service>("services").findOne({ _id: objectId })
}

// Invoice Operations
export async function createInvoice(invoiceData: Omit<Invoice, "_id" | "createdAt" | "updatedAt">): Promise<ObjectId> {
  const db = await getDatabase()
  const now = new Date()

  const invoice: Invoice = {
    ...invoiceData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection<Invoice>("invoices").insertOne(invoice)
  return result.insertedId
}

export async function getUserInvoices(userId: string | ObjectId): Promise<Invoice[]> {
  const db = await getDatabase()
  const objectId = typeof userId === "string" ? new ObjectId(userId) : userId

  return await db.collection<Invoice>("invoices").find({ userId: objectId }).sort({ issueDate: -1 }).toArray()
}

// Review Operations
export async function createReview(reviewData: Omit<Review, "_id" | "createdAt" | "updatedAt">): Promise<ObjectId> {
  const db = await getDatabase()
  const now = new Date()

  const review: Review = {
    ...reviewData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection<Review>("reviews").insertOne(review)
  return result.insertedId
}

export async function getBookingReviews(bookingId: string | ObjectId): Promise<Review[]> {
  const db = await getDatabase()
  const objectId = typeof bookingId === "string" ? new ObjectId(bookingId) : bookingId

  return await db.collection<Review>("reviews").find({ bookingId: objectId }).toArray()
}
