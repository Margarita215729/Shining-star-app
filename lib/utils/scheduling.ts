// Scheduling utilities for availability checking and slot management
export interface TimeSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
  cleanerId?: string
  estimatedDuration: number
}

export interface AvailabilityRequest {
  startDate: string
  endDate: string
  estimatedDuration: number
  serviceArea?: { lat: number; lng: number }
}

export interface DayAvailability {
  date: string
  slots: TimeSlot[]
  hasAvailability: boolean
}

// Generate available time slots for a date range
export function generateAvailableSlots(
  startDate: Date,
  endDate: Date,
  estimatedDuration = 120, // minutes
): DayAvailability[] {
  const days: DayAvailability[] = []
  const current = new Date(startDate)

  while (current <= endDate) {
    const daySlots = generateDaySlotsForDate(current, estimatedDuration)
    days.push({
      date: current.toISOString().split("T")[0],
      slots: daySlots,
      hasAvailability: daySlots.some((slot) => slot.isAvailable),
    })
    current.setDate(current.getDate() + 1)
  }

  return days
}

function generateDaySlotsForDate(date: Date, duration: number): TimeSlot[] {
  const slots: TimeSlot[] = []
  const dayOfWeek = date.getDay()

  // Skip Sundays (0) for demo
  if (dayOfWeek === 0) return slots

  // Business hours: 8 AM to 6 PM
  const startHour = 8
  const endHour = 18
  const slotInterval = 60 // 1-hour intervals

  for (let hour = startHour; hour < endHour; hour += slotInterval / 60) {
    const startTime = `${hour.toString().padStart(2, "0")}:00`
    const endTime = `${(hour + duration / 60).toString().padStart(2, "0")}:00`

    // Skip if end time exceeds business hours
    if (hour + duration / 60 > endHour) continue

    // Mock availability - in production, check against actual bookings
    const isAvailable = Math.random() > 0.3 // 70% availability rate

    slots.push({
      id: `${date.toISOString().split("T")[0]}-${startTime}`,
      date: date.toISOString().split("T")[0],
      startTime,
      endTime,
      isAvailable,
      estimatedDuration: duration,
    })
  }

  return slots
}

export function formatTimeSlot(slot: TimeSlot): string {
  const startTime = new Date(`2000-01-01T${slot.startTime}`)
  const endTime = new Date(`2000-01-01T${slot.endTime}`)

  return `${startTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })} - ${endTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`
}

export function estimateServiceDuration(services: any[]): number {
  // Base duration estimates per service type (in minutes)
  const baseDurations: Record<string, number> = {
    toilet: 30,
    bath: 45,
    "bathroom-floor": 30,
    dust: 60,
    "textile-furniture": 45,
    "wall-stains": 30,
    windows: 15,
    "floor-cleaning": 2, // per sqft
    "wall-cleaning": 1.5, // per sqft
  }

  let totalDuration = 0

  services.forEach((service) => {
    const baseDuration = baseDurations[service.id] || 30
    let serviceDuration = baseDuration * service.quantity

    // Adjust for size multipliers
    if (service.size) {
      const sizeMultipliers = { small: 1, medium: 1.5, large: 2 }
      serviceDuration *= sizeMultipliers[service.size as keyof typeof sizeMultipliers] || 1
    }

    totalDuration += serviceDuration
  })

  // Add 30 minutes buffer and round up to nearest 30 minutes
  totalDuration += 30
  return Math.ceil(totalDuration / 30) * 30
}
