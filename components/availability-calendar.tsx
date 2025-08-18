"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, CalendarIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { formatTimeSlot, type TimeSlot, type DayAvailability } from "@/lib/utils/scheduling"
import type { GeocodingResult } from "@/lib/utils/geocoding"

interface AvailabilityCalendarProps {
  services: any[]
  geocoding?: GeocodingResult
  onSlotSelect: (slot: TimeSlot) => void
  selectedSlot?: TimeSlot
}

export function AvailabilityCalendar({ services, geocoding, onSlotSelect, selectedSlot }: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [availability, setAvailability] = useState<DayAvailability[]>([])
  const [estimatedDuration, setEstimatedDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (services.length > 0) {
      fetchAvailability()
    }
  }, [services, geocoding])

  const fetchAvailability = async () => {
    setIsLoading(true)
    setError("")

    try {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 14) // Next 2 weeks

      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          services,
          coordinates: geocoding?.coordinates,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === "OUTSIDE_SERVICE_AREA") {
          setError(data.message)
          return
        }
        throw new Error(data.error || "Failed to fetch availability")
      }

      setAvailability(data.availability)
      setEstimatedDuration(data.estimatedDuration)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load availability")
    } finally {
      setIsLoading(false)
    }
  }

  const getDateAvailability = (date: Date): DayAvailability | undefined => {
    const dateString = date.toISOString().split("T")[0]
    return availability.find((day) => day.date === dateString)
  }

  const selectedDateAvailability = selectedDate ? getDateAvailability(selectedDate) : undefined

  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select services to view available appointment times</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Select Date & Time
          </CardTitle>
          <CardDescription>
            Choose your preferred appointment slot
            {estimatedDuration > 0 && (
              <span className="block mt-1 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Estimated duration: {Math.floor(estimatedDuration / 60)}h {estimatedDuration % 60}m
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <span className="ml-2">Loading availability...</span>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    if (date < today) return true

                    const dayAvailability = getDateAvailability(date)
                    return !dayAvailability?.hasAvailability
                  }}
                  modifiers={{
                    available: (date) => {
                      const dayAvailability = getDateAvailability(date)
                      return dayAvailability?.hasAvailability || false
                    },
                  }}
                  modifiersStyles={{
                    available: {
                      backgroundColor: "hsl(var(--primary))",
                      color: "hsl(var(--primary-foreground))",
                    },
                  }}
                  className="rounded-md border"
                />
              </div>

              {/* Time Slots */}
              <div>
                <h4 className="font-medium mb-4">
                  {selectedDate
                    ? `Available times for ${selectedDate.toLocaleDateString()}`
                    : "Select a date to view available times"}
                </h4>

                <AnimatePresence mode="wait">
                  {selectedDate && selectedDateAvailability ? (
                    <motion.div
                      key={selectedDate.toISOString()}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-2 max-h-64 overflow-y-auto"
                    >
                      {selectedDateAvailability.slots
                        .filter((slot) => slot.isAvailable)
                        .map((slot) => (
                          <Button
                            key={slot.id}
                            variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => onSlotSelect(slot)}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            {formatTimeSlot(slot)}
                          </Button>
                        ))}

                      {selectedDateAvailability.slots.filter((slot) => slot.isAvailable).length === 0 && (
                        <p className="text-center text-muted-foreground py-4">No available times for this date</p>
                      )}
                    </motion.div>
                  ) : selectedDate ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-muted-foreground py-4"
                    >
                      No availability for selected date
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-muted-foreground py-8"
                    >
                      <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      Select a date to view available appointment times
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSlot && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Selected appointment:</strong> {new Date(selectedSlot.date).toLocaleDateString()}
              at {formatTimeSlot(selectedSlot)}
              <br />
              <span className="text-sm text-muted-foreground">
                Duration: {Math.floor(selectedSlot.estimatedDuration / 60)}h {selectedSlot.estimatedDuration % 60}m
              </span>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  )
}
