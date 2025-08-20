import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const packages = await prisma.servicePackage.findMany({
      where: { 
        isDeleted: false,
        isActive: true 
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ packages })
  } catch (error) {
    console.error("Packages fetch failed:", error)
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, serviceIds, basePrice, discountPercent, estimatedDuration } = await request.json()

    const servicePackage = await prisma.servicePackage.create({
      data: {
        name,
        description,
        serviceIds: serviceIds || [],
        basePrice: parseFloat(basePrice),
        discountPercent: parseFloat(discountPercent) || 0,
        estimatedDuration: parseInt(estimatedDuration),
      }
    })

    return NextResponse.json({ package: servicePackage }, { status: 201 })
  } catch (error) {
    console.error("Package creation failed:", error)
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 })
  }
}