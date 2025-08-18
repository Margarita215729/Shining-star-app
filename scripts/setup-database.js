// Database setup script for Shining Star Cleaning Services
import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "shining-star"

async function setupDatabase() {
  console.log("🚀 Setting up Shining Star database...")

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db(DB_NAME)

    // Create collections with validation schemas
    console.log("📋 Creating collections...")

    // Users collection
    await db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["email", "password", "firstName", "lastName", "role"],
          properties: {
            email: { bsonType: "string" },
            password: { bsonType: "string" },
            firstName: { bsonType: "string" },
            lastName: { bsonType: "string" },
            role: { enum: ["customer", "admin", "cleaner"] },
            loyaltyPoints: { bsonType: "number", minimum: 0 },
            isActive: { bsonType: "bool" },
          },
        },
      },
    })

    // Bookings collection
    await db.createCollection("bookings", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["userId", "serviceId", "status", "scheduledDate"],
          properties: {
            userId: { bsonType: "objectId" },
            serviceId: { bsonType: "objectId" },
            status: { enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"] },
            scheduledDate: { bsonType: "date" },
          },
        },
      },
    })

    // Services collection
    await db.createCollection("services")

    // Invoices collection
    await db.createCollection("invoices")

    // Reviews collection
    await db.createCollection("reviews")

    // Create indexes for better performance
    console.log("🔍 Creating indexes...")

    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("users").createIndex({ role: 1 })

    await db.collection("bookings").createIndex({ userId: 1 })
    await db.collection("bookings").createIndex({ status: 1 })
    await db.collection("bookings").createIndex({ scheduledDate: 1 })

    await db.collection("services").createIndex({ category: 1 })
    await db.collection("services").createIndex({ isActive: 1 })

    await db.collection("invoices").createIndex({ userId: 1 })
    await db.collection("invoices").createIndex({ status: 1 })

    await db.collection("reviews").createIndex({ bookingId: 1 })
    await db.collection("reviews").createIndex({ rating: 1 })

    console.log("✅ Database setup completed successfully!")
  } catch (error) {
    console.error("❌ Error setting up database:", error)
    throw error
  } finally {
    await client.close()
  }
}

// Run the setup
setupDatabase().catch(console.error)
