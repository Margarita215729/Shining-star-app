// Seed script to migrate service packages from JSON to database
import { prisma } from "../lib/prisma.js"

const servicePackages = [
  {
    id: "basic_package",
    name: "Basic Cleaning Package",
    description: "Essential cleaning services for small spaces",
    serviceIds: ["windows", "mirrors", "floors"],
    basePrice: 40,
    discountPercent: 10,
    estimatedDuration: 60,
    displayOrder: 1
  },
  {
    id: "premium_package", 
    name: "Premium Cleaning Package",
    description: "Comprehensive cleaning solution for homes and offices",
    serviceIds: ["refrigerator", "windows", "bathroom", "mirrors", "floors", "windowsills"],
    basePrice: 120,
    discountPercent: 20,
    estimatedDuration: 150,
    displayOrder: 2
  },
  {
    id: "deep_clean_package",
    name: "Deep Clean Package", 
    description: "Complete deep cleaning with stain removal services",
    serviceIds: ["refrigerator", "windows", "bathroom", "mirrors", "floors", "windowsills", "carpet_stains", "wall_stains"],
    basePrice: 180,
    discountPercent: 25,
    estimatedDuration: 210,
    displayOrder: 3
  }
]

const portfolioSamples = [
  {
    title: "Kitchen Deep Clean Transformation",
    description: "Complete kitchen cleaning including appliances, cabinets, and deep scrubbing of all surfaces.",
    category: "kitchen",
    beforeImages: ["/images/portfolio/kitchen-before-1.jpg"],
    afterImages: ["/images/portfolio/kitchen-after-1.jpg"],
    tags: ["deep clean", "kitchen", "appliances"],
    isPublished: true,
    displayOrder: 1
  },
  {
    title: "Bathroom Restoration",
    description: "Full bathroom cleaning and sanitization with special attention to tile, grout, and fixtures.",
    category: "bathroom", 
    beforeImages: ["/images/portfolio/bathroom-before-1.jpg"],
    afterImages: ["/images/portfolio/bathroom-after-1.jpg"],
    tags: ["bathroom", "sanitization", "tile cleaning"],
    isPublished: true,
    displayOrder: 2
  },
  {
    title: "Office Space Cleaning", 
    description: "Professional office cleaning including workstations, common areas, and meeting rooms.",
    category: "office",
    beforeImages: ["/images/portfolio/office-before-1.jpg"],
    afterImages: ["/images/portfolio/office-after-1.jpg"],
    tags: ["commercial", "office", "workspace"],
    isPublished: true,
    displayOrder: 3
  }
]

async function seedServicePackages() {
  console.log("🌱 Seeding service packages...")
  
  for (const packageData of servicePackages) {
    try {
      await prisma.servicePackage.upsert({
        where: { id: packageData.id },
        update: packageData,
        create: packageData
      })
      console.log(`✅ Created/updated package: ${packageData.name}`)
    } catch (error) {
      console.error(`❌ Error creating package ${packageData.name}:`, error)
    }
  }
}

async function seedPortfolio() {
  console.log("🌱 Seeding portfolio...")
  
  for (const portfolioData of portfolioSamples) {
    try {
      await prisma.portfolio.create({
        data: portfolioData
      })
      console.log(`✅ Created portfolio item: ${portfolioData.title}`)
    } catch (error) {
      console.error(`❌ Error creating portfolio item ${portfolioData.title}:`, error)
    }
  }
}

async function main() {
  try {
    await seedServicePackages()
    await seedPortfolio()
    console.log("🎉 Seeding completed successfully!")
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()