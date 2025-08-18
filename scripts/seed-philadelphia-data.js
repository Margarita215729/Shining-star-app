import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seedPhiladelphiaData() {
  console.log("🌱 Seeding Philadelphia demo data...")

  try {
    // Create organization
    const org = await prisma.org.create({
      data: {
        name: "Shining Star Cleaning Philadelphia",
        address: "1234 Market St, Philadelphia, PA 19107",
        phone: "(215) 555-0123",
        email: "philadelphia@shiningstar.com",
      },
    })

    // Create packages
    const packages = await Promise.all([
      prisma.package.create({
        data: {
          name: "Basic Clean",
          description: "Essential cleaning services for your home",
          type: "BASIC",
          discount: 0,
          minServices: 1,
          maxServices: 3,
        },
      }),
      prisma.package.create({
        data: {
          name: "Premium Clean",
          description: "Comprehensive cleaning with extra attention to detail",
          type: "PREMIUM",
          discount: 10,
          minServices: 3,
          maxServices: 8,
        },
      }),
      prisma.package.create({
        data: {
          name: "Deep Clean",
          description: "Intensive cleaning for move-ins, move-outs, or seasonal cleaning",
          type: "DEEP_CLEAN",
          discount: 15,
          minServices: 5,
        },
      }),
    ])

    // Create 25+ services
    const services = [
      // Bathroom Services
      {
        name: "Toilet Deep Clean",
        description: "Complete toilet sanitization and cleaning",
        category: "RESIDENTIAL",
        basePrice: 25,
        duration: 15,
        unit: "toilet",
      },
      {
        name: "Bathtub & Shower Scrub",
        description: "Deep scrubbing of bathtub and shower areas",
        category: "RESIDENTIAL",
        basePrice: 35,
        duration: 25,
        unit: "bathroom",
      },
      {
        name: "Bathroom Tile & Grout",
        description: "Specialized tile and grout cleaning",
        category: "RESIDENTIAL",
        basePrice: 45,
        duration: 30,
        unit: "bathroom",
      },

      // Kitchen Services
      {
        name: "Kitchen Deep Clean",
        description: "Complete kitchen cleaning including appliances",
        category: "RESIDENTIAL",
        basePrice: 60,
        duration: 45,
        unit: "kitchen",
      },
      {
        name: "Oven Interior Clean",
        description: "Deep cleaning of oven interior",
        category: "RESIDENTIAL",
        basePrice: 40,
        duration: 30,
        unit: "oven",
      },
      {
        name: "Refrigerator Clean",
        description: "Interior and exterior refrigerator cleaning",
        category: "RESIDENTIAL",
        basePrice: 30,
        duration: 20,
        unit: "refrigerator",
      },

      // Dusting Services
      {
        name: "General Dusting",
        description: "Dusting of all surfaces and furniture",
        category: "RESIDENTIAL",
        basePrice: 20,
        duration: 20,
        unit: "room",
      },
      {
        name: "Ceiling Fan Cleaning",
        description: "Detailed cleaning of ceiling fans",
        category: "RESIDENTIAL",
        basePrice: 15,
        duration: 10,
        unit: "fan",
      },
      {
        name: "Baseboards & Trim",
        description: "Detailed cleaning of baseboards and trim",
        category: "RESIDENTIAL",
        basePrice: 25,
        duration: 15,
        unit: "room",
      },

      // Textile & Furniture
      {
        name: "Upholstery Cleaning",
        description: "Professional upholstery cleaning",
        category: "RESIDENTIAL",
        basePrice: 80,
        duration: 45,
        unit: "piece",
      },
      {
        name: "Carpet Steam Clean",
        description: "Deep steam cleaning of carpets",
        category: "RESIDENTIAL",
        basePrice: 50,
        duration: 30,
        unit: "room",
      },
      {
        name: "Curtain Cleaning",
        description: "Professional curtain cleaning service",
        category: "RESIDENTIAL",
        basePrice: 35,
        duration: 20,
        unit: "panel",
      },

      // Wall & Surface Cleaning
      {
        name: "Wall Stain Removal",
        description: "Specialized stain removal from walls",
        category: "RESIDENTIAL",
        basePrice: 30,
        duration: 20,
        unit: "stain",
      },
      {
        name: "Wall Washing",
        description: "Complete wall washing service",
        category: "RESIDENTIAL",
        basePrice: 40,
        duration: 25,
        unit: "room",
      },
      {
        name: "Cabinet Cleaning",
        description: "Interior and exterior cabinet cleaning",
        category: "RESIDENTIAL",
        basePrice: 35,
        duration: 25,
        unit: "kitchen",
      },

      // Window Services
      {
        name: "Interior Window Cleaning",
        description: "Interior window and sill cleaning",
        category: "RESIDENTIAL",
        basePrice: 8,
        duration: 5,
        unit: "window",
      },
      {
        name: "Exterior Window Cleaning",
        description: "Exterior window cleaning service",
        category: "RESIDENTIAL",
        basePrice: 12,
        duration: 8,
        unit: "window",
      },
      {
        name: "Window Screen Cleaning",
        description: "Cleaning of window screens",
        category: "RESIDENTIAL",
        basePrice: 5,
        duration: 3,
        unit: "screen",
      },

      // Floor Services by Square Footage
      {
        name: "Hardwood Floor Polish",
        description: "Professional hardwood floor polishing",
        category: "RESIDENTIAL",
        basePrice: 2.5,
        duration: 2,
        unit: "sqft",
      },
      {
        name: "Tile Floor Deep Clean",
        description: "Deep cleaning and mopping of tile floors",
        category: "RESIDENTIAL",
        basePrice: 1.8,
        duration: 1.5,
        unit: "sqft",
      },
      {
        name: "Laminate Floor Care",
        description: "Specialized laminate floor cleaning",
        category: "RESIDENTIAL",
        basePrice: 1.5,
        duration: 1,
        unit: "sqft",
      },
      {
        name: "Vinyl Floor Cleaning",
        description: "Professional vinyl floor cleaning",
        category: "RESIDENTIAL",
        basePrice: 1.2,
        duration: 1,
        unit: "sqft",
      },

      // Specialized Services
      {
        name: "Post-Construction Cleanup",
        description: "Cleanup after construction or renovation",
        category: "SPECIALIZED",
        basePrice: 150,
        duration: 120,
        unit: "room",
      },
      {
        name: "Move-In/Move-Out Clean",
        description: "Complete cleaning for moving",
        category: "SPECIALIZED",
        basePrice: 200,
        duration: 180,
        unit: "home",
      },
      {
        name: "Garage Cleaning",
        description: "Complete garage cleaning and organization",
        category: "RESIDENTIAL",
        basePrice: 100,
        duration: 90,
        unit: "garage",
      },
      {
        name: "Basement Cleaning",
        description: "Deep cleaning of basement areas",
        category: "RESIDENTIAL",
        basePrice: 80,
        duration: 60,
        unit: "basement",
      },

      // Commercial Services
      {
        name: "Office Space Cleaning",
        description: "Professional office cleaning service",
        category: "COMMERCIAL",
        basePrice: 1.0,
        duration: 0.5,
        unit: "sqft",
      },
      {
        name: "Retail Space Cleaning",
        description: "Specialized retail space cleaning",
        category: "COMMERCIAL",
        basePrice: 1.2,
        duration: 0.8,
        unit: "sqft",
      },
      {
        name: "Medical Office Sanitization",
        description: "Medical-grade cleaning and sanitization",
        category: "COMMERCIAL",
        basePrice: 2.0,
        duration: 1.2,
        unit: "sqft",
      },
    ]

    const createdServices = await Promise.all(
      services.map((service) =>
        prisma.service.create({
          data: {
            ...service,
            features: ["Professional equipment", "Eco-friendly products", "Insured service", "Quality guarantee"],
          },
        }),
      ),
    )

    // Create pricing rules for square footage tiers
    const floorServices = createdServices.filter((s) => s.unit === "sqft")

    for (const service of floorServices) {
      await Promise.all([
        // Small area discount (under 500 sqft)
        prisma.pricingRule.create({
          data: {
            serviceId: service.id,
            name: "Small Area Minimum",
            condition: { sqft: { max: 500 } },
            modifier: 50, // minimum charge
            modifierType: "FIXED_AMOUNT",
            priority: 1,
          },
        }),
        // Large area discount (over 2000 sqft)
        prisma.pricingRule.create({
          data: {
            serviceId: service.id,
            name: "Large Area Discount",
            condition: { sqft: { min: 2000 } },
            modifier: 0.85, // 15% discount
            modifierType: "MULTIPLIER",
            priority: 2,
          },
        }),
      ])
    }

    // Create sample cleaners
    const cleaners = await Promise.all([
      prisma.cleaner.create({
        data: {
          email: "maria.garcia@shiningstar.com",
          firstName: "Maria",
          lastName: "Garcia",
          phone: "(215) 555-0124",
          orgId: org.id,
          skills: ["Residential", "Deep Cleaning", "Eco-Friendly"],
          certifications: ["OSHA Safety", "Green Cleaning"],
          hourlyRate: 25.0,
        },
      }),
      prisma.cleaner.create({
        data: {
          email: "james.wilson@shiningstar.com",
          firstName: "James",
          lastName: "Wilson",
          phone: "(215) 555-0125",
          orgId: org.id,
          skills: ["Commercial", "Floor Care", "Window Cleaning"],
          certifications: ["Commercial Cleaning", "Floor Care Specialist"],
          hourlyRate: 28.0,
        },
      }),
    ])

    // Create sample coupons
    await Promise.all([
      prisma.coupon.create({
        data: {
          code: "WELCOME20",
          name: "New Customer Welcome",
          description: "20% off your first cleaning",
          discountType: "PERCENTAGE",
          discountValue: 20,
          maxDiscount: 100,
          usageLimit: 1000,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
      }),
      prisma.coupon.create({
        data: {
          code: "SPRING50",
          name: "Spring Cleaning Special",
          description: "$50 off deep cleaning services",
          discountType: "FIXED_AMOUNT",
          discountValue: 50,
          minOrderAmount: 200,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        },
      }),
    ])

    console.log("✅ Philadelphia demo data seeded successfully!")
    console.log(`📦 Created ${packages.length} packages`)
    console.log(`🧹 Created ${createdServices.length} services`)
    console.log(`👥 Created ${cleaners.length} cleaners`)
    console.log("🎟️ Created sample coupons")
  } catch (error) {
    console.error("❌ Error seeding data:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedPhiladelphiaData().catch(console.error)
