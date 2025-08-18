// Seed script for cleaning services data
import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "shining-star"

const services = [
  {
    name: "Residential Cleaning",
    description: "Regular house cleaning service for homes and apartments",
    category: "residential",
    basePrice: 120,
    duration: 120, // 2 hours
    features: [
      "Dusting all surfaces",
      "Vacuuming carpets and rugs",
      "Mopping floors",
      "Cleaning bathrooms",
      "Kitchen cleaning",
      "Trash removal",
    ],
    addOns: [
      { name: "Inside Oven Cleaning", description: "Deep clean inside of oven", price: 25 },
      { name: "Inside Refrigerator", description: "Clean inside of refrigerator", price: 20 },
      { name: "Window Cleaning (Interior)", description: "Clean interior windows", price: 30 },
      { name: "Garage Cleaning", description: "Sweep and organize garage", price: 40 },
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Deep Cleaning",
    description: "Comprehensive deep cleaning service for thorough home sanitization",
    category: "residential",
    basePrice: 250,
    duration: 300, // 5 hours
    features: [
      "All standard cleaning services",
      "Baseboards and window sills",
      "Light fixtures and ceiling fans",
      "Inside appliances",
      "Cabinet fronts and handles",
      "Door frames and switches",
      "Detailed bathroom scrubbing",
      "Behind furniture cleaning",
    ],
    addOns: [
      { name: "Carpet Steam Cleaning", description: "Professional carpet steam cleaning", price: 80 },
      { name: "Upholstery Cleaning", description: "Clean furniture upholstery", price: 60 },
      { name: "Mattress Cleaning", description: "Deep clean mattresses", price: 50 },
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Move-In/Move-Out Cleaning",
    description: "Specialized cleaning for moving transitions",
    category: "specialized",
    basePrice: 300,
    duration: 360, // 6 hours
    features: [
      "Complete deep cleaning",
      "Inside all cabinets and drawers",
      "All appliances inside and out",
      "Closet cleaning",
      "Garage and basement",
      "Window cleaning (interior)",
      "Wall washing",
      "Floor deep cleaning",
    ],
    addOns: [
      { name: "Exterior Window Cleaning", description: "Clean exterior windows", price: 50 },
      { name: "Pressure Washing", description: "Pressure wash exterior surfaces", price: 100 },
      { name: "Carpet Replacement Prep", description: "Prepare floors for new carpet", price: 75 },
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Office Cleaning",
    description: "Professional commercial office cleaning services",
    category: "commercial",
    basePrice: 200,
    duration: 180, // 3 hours
    features: [
      "Desk and workspace cleaning",
      "Trash and recycling removal",
      "Restroom sanitization",
      "Kitchen/break room cleaning",
      "Vacuuming and mopping",
      "Window and glass cleaning",
      "Disinfection of high-touch surfaces",
    ],
    addOns: [
      { name: "Conference Room Deep Clean", description: "Detailed conference room cleaning", price: 40 },
      { name: "Carpet Cleaning", description: "Professional carpet cleaning", price: 60 },
      { name: "Floor Waxing", description: "Strip and wax hard floors", price: 80 },
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Post-Construction Cleanup",
    description: "Specialized cleaning after construction or renovation work",
    category: "specialized",
    basePrice: 400,
    duration: 480, // 8 hours
    features: [
      "Dust and debris removal",
      "Window cleaning (interior/exterior)",
      "Floor cleaning and polishing",
      "Fixture and surface cleaning",
      "Paint splatter removal",
      "HVAC vent cleaning",
      "Final walkthrough inspection",
    ],
    addOns: [
      { name: "Heavy Equipment Cleaning", description: "Clean construction equipment", price: 100 },
      { name: "Dumpster Coordination", description: "Coordinate debris removal", price: 50 },
      { name: "Touch-up Cleaning", description: "Return for touch-up cleaning", price: 75 },
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedServices() {
  console.log("🌱 Seeding cleaning services...")

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db(DB_NAME)
    const collection = db.collection("services")

    // Clear existing services
    await collection.deleteMany({})
    console.log("🗑️ Cleared existing services")

    // Insert new services
    const result = await collection.insertMany(services)
    console.log(`✅ Inserted ${result.insertedCount} services`)

    // Display inserted services
    services.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.name} - $${service.basePrice} (${service.category})`)
    })
  } catch (error) {
    console.error("❌ Error seeding services:", error)
    throw error
  } finally {
    await client.close()
  }
}

// Run the seeding
seedServices().catch(console.error)
