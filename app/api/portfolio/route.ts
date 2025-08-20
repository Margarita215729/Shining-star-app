import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const portfolio = await prisma.portfolio.findMany({
      where: { 
        isDeleted: false,
        isPublished: true 
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error("Portfolio fetch failed:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, category, beforeImages, afterImages, tags, projectDate } = await request.json()

    const portfolio = await prisma.portfolio.create({
      data: {
        title,
        description,
        category,
        beforeImages: beforeImages || [],
        afterImages: afterImages || [],
        tags: tags || [],
        projectDate: projectDate ? new Date(projectDate) : null,
      }
    })

    return NextResponse.json({ portfolio }, { status: 201 })
  } catch (error) {
    console.error("Portfolio creation failed:", error)
    return NextResponse.json({ error: "Failed to create portfolio item" }, { status: 500 })
  }
}