// Script to create an admin user for the Shining Star app
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "shining-star"

async function createAdminUser() {
  console.log("👤 Creating admin user...")

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db(DB_NAME)
    const collection = db.collection("users")

    // Check if admin already exists
    const existingAdmin = await collection.findOne({ email: "admin@shiningstar.com" })

    if (existingAdmin) {
      console.log("⚠️ Admin user already exists")
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123!", 12)

    const adminUser = {
      email: "admin@shiningstar.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      phone: "(215) 555-0100",
      address: {
        street: "100 Admin St",
        city: "Philadelphia",
        state: "PA",
        zipCode: "19103",
      },
      role: "admin",
      loyaltyPoints: 0,
      memberSince: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(adminUser)
    console.log("✅ Admin user created successfully!")
    console.log("📧 Email: admin@shiningstar.com")
    console.log("🔑 Password: admin123!")
    console.log(`🆔 User ID: ${result.insertedId}`)
  } catch (error) {
    console.error("❌ Error creating admin user:", error)
    throw error
  } finally {
    await client.close()
  }
}

// Run the script
createAdminUser().catch(console.error)
