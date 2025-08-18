import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserBookings, createBooking } from "@/lib/database-operations"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const bookings = await getUserBookings(session.user.id, status || undefined)

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const bookingData = {
      userId: new ObjectId(session.user.id),
      serviceId: new ObjectId(body.serviceId),
      status: "pending" as const,
      scheduledDate: new Date(body.scheduledDate),
      scheduledTime: body.scheduledTime,
      duration: body.duration,
      address: body.address,
      pricing: body.pricing,
      notes: body.notes,
      specialRequests: body.specialRequests || [],
      estimatedDuration: body.estimatedDuration,
    }

    const bookingId = await createBooking(bookingData)

    return NextResponse.json({ bookingId }, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
