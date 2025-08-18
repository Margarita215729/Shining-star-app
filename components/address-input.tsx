"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { MapPin, AlertTriangle, CheckCircle } from "lucide-react"
import { geocodeAddress, type GeocodingResult } from "@/lib/utils/geocoding"
import { motion, AnimatePresence } from "framer-motion"

interface AddressInputProps {
  value: string
  onChange: (value: string, geocoding?: GeocodingResult) => void
  error?: string
  required?: boolean
}

export function AddressInput({ value, onChange, error, required }: AddressInputProps) {
  const [geocoding, setGeocoding] = useState<GeocodingResult | null>(null)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [showServiceAreaWarning, setShowServiceAreaWarning] = useState(false)

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (value.length > 10) {
        setIsGeocoding(true)
        const result = await geocodeAddress(value)
        setGeocoding(result)
        setIsGeocoding(false)

        if (result && !result.isWithinServiceArea) {
          setShowServiceAreaWarning(true)
        } else {
          setShowServiceAreaWarning(false)
        }

        onChange(value, result || undefined)
      } else {
        setGeocoding(null)
        setShowServiceAreaWarning(false)
        onChange(value)
      }
    }, 1000)

    return () => clearTimeout(debounceTimer)
  }, [value, onChange])

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="address" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Service Address {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="relative">
          <Input
            id="address"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your full address (Street, City, State, ZIP)"
            className={error ? "border-red-500" : ""}
          />
          {isGeocoding && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <AnimatePresence>
        {geocoding && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              {geocoding.isWithinServiceArea ? (
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Service Available
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Outside Service Area
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">{geocoding.distance.toFixed(1)} miles from center</span>
            </div>
          </motion.div>
        )}

        {showServiceAreaWarning && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This address is outside our 10-mile service radius from Philadelphia City Hall. Please contact us
                directly at (215) 555-0123 for special arrangements.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
