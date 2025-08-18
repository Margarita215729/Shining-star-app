// Geocoding utilities for address validation and service area enforcement
export interface Coordinates {
  lat: number
  lng: number
}

export interface GeocodingResult {
  coordinates: Coordinates
  formattedAddress: string
  isWithinServiceArea: boolean
  distance: number
}

// Philadelphia City Hall coordinates
const PHILADELPHIA_CENTER: Coordinates = {
  lat: 39.9526,
  lng: -75.1652,
}

const SERVICE_RADIUS_MILES = 10

// Haversine formula to calculate distance between two points
export function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRadians(point2.lat - point1.lat)
  const dLng = toRadians(point2.lng - point1.lng)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function isWithinServiceArea(coordinates: Coordinates): boolean {
  const distance = calculateDistance(PHILADELPHIA_CENTER, coordinates)
  return distance <= SERVICE_RADIUS_MILES
}

// Client-side geocoding using browser geolocation or address input
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  try {
    // In a real app, you'd use Google Maps Geocoding API or similar
    // For demo purposes, we'll simulate geocoding with some Philadelphia area coordinates
    const mockCoordinates = getMockCoordinatesForAddress(address)

    const distance = calculateDistance(PHILADELPHIA_CENTER, mockCoordinates)
    const isWithinArea = distance <= SERVICE_RADIUS_MILES

    return {
      coordinates: mockCoordinates,
      formattedAddress: address,
      isWithinServiceArea: isWithinArea,
      distance,
    }
  } catch (error) {
    console.error("Geocoding failed:", error)
    return null
  }
}

// Mock geocoding for demo - in production, use real geocoding service
function getMockCoordinatesForAddress(address: string): Coordinates {
  // Generate coordinates within and outside Philadelphia area for demo
  const lowerAddress = address.toLowerCase()

  if (lowerAddress.includes("philadelphia") || lowerAddress.includes("philly")) {
    // Within service area
    return {
      lat: 39.9526 + (Math.random() - 0.5) * 0.1,
      lng: -75.1652 + (Math.random() - 0.5) * 0.1,
    }
  } else if (lowerAddress.includes("new york") || lowerAddress.includes("nyc")) {
    // Outside service area
    return { lat: 40.7128, lng: -74.006 }
  } else {
    // Random Philadelphia area coordinate
    return {
      lat: 39.9526 + (Math.random() - 0.5) * 0.2,
      lng: -75.1652 + (Math.random() - 0.5) * 0.2,
    }
  }
}
