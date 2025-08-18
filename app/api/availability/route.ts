import { type NextRequest, NextResponse } from "next/server"
import { generateAvailableSlots, estimateServiceDuration } from "@/lib/utils/scheduling"
import { isWithinServiceArea, calculateDistance } from "@/lib/utils/geocoding"

const PHILADELPHIA_CENTER = { lat: 39.9526, lng: -75.1652 }

export async function POST(request: NextRequest) {
  try {
    const { startDate, endDate, services, coordinates } = await request.json()

    // Validate service area
    if (coordinates && !isWithinServiceArea(coordinates)) {
      const distance = calculateDistance(PHILADELPHIA_CENTER, coordinates)
      return NextResponse.json(
        {
          error: "OUTSIDE_SERVICE_AREA",
          message: `Service location is ${distance.toFixed(1)} miles from our service center. We only serve within 10 miles of Philadelphia.`,
          distance,
        },
        { status: 400 },
      )
    }

    // Calculate estimated duration
    const estimatedDuration = estimateServiceDuration(services || [])

    // Generate available slots
    const start = new Date(startDate)
    const end = new Date(endDate)
    const availability = generateAvailableSlots(start, end, estimatedDuration)

    return NextResponse.json({
      availability,
      estimatedDuration,
      serviceArea: {
        center: PHILADELPHIA_CENTER,
        radius: 10,
        isWithinArea: !coordinates || isWithinServiceArea(coordinates),
      },
    })
  } catch (error) {
    console.error("Availability check failed:", error)
    return NextResponse.json({ error: "Failed to check availability" }, { status: 500 })
  }
}
