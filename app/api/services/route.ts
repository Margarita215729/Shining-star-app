import { type NextRequest, NextResponse } from "next/server"
import { getServices } from "@/lib/database-operations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    const services = await getServices(category || undefined)

    return NextResponse.json({ services })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
