"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, CheckCircle, AlertTriangle, Calculator, Package } from "lucide-react"
import { AddressInput } from "@/components/address-input"
import { AvailabilityCalendar } from "@/components/availability-calendar"
import type { GeocodingResult } from "@/lib/utils/geocoding"
import type { TimeSlot } from "@/lib/utils/scheduling"

const serviceBuilderSchema = z.object({
  services: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number().min(1),
        size: z.string().optional(),
        frequency: z.enum(["one-time", "weekly", "bi-weekly", "monthly"]),
        addOns: z.array(z.string()).default([]),
      }),
    )
    .min(1, "Please select at least one service"),
  packageId: z.string().optional(),
  customerInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    address: z.string().min(1, "Address is required"),
  }),
  selectedSlot: z
    .object({
      id: z.string(),
      date: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      estimatedDuration: z.number(),
    })
    .optional(),
})

type ServiceBuilderForm = z.infer<typeof serviceBuilderSchema>

const serviceCategories = [
  {
    id: "bathroom",
    name: "Bathroom Services",
    services: [
      { id: "toilet", name: "Toilet Cleaning", basePrice: 15, unit: "each" },
      { id: "bath", name: "Bath/Shower Cleaning", basePrice: 25, unit: "each" },
      { id: "bathroom-floor", name: "Bathroom Floor", basePrice: 20, unit: "each" },
    ],
  },
  {
    id: "general",
    name: "General Cleaning",
    services: [
      { id: "dust", name: "Dust Removing", basePrice: 30, unit: "room" },
      { id: "textile-furniture", name: "Textile Furniture", basePrice: 40, unit: "piece" },
      { id: "wall-stains", name: "Wall Stain Removal", basePrice: 35, unit: "wall" },
    ],
  },
  {
    id: "windows-floors",
    name: "Windows & Floors",
    services: [
      { id: "windows", name: "Window Cleaning", basePrice: 8, unit: "window", hasSizes: true },
      { id: "floor-cleaning", name: "Floor Cleaning", basePrice: 2, unit: "sqft", hasSizes: true },
      { id: "wall-cleaning", name: "Wall Cleaning", basePrice: 1.5, unit: "sqft", hasSizes: true },
    ],
  },
]

const packages = [
  { id: "basic", name: "Basic Package", discount: 0.1, minServices: 3, description: "10% off any 3 services" },
  { id: "premium", name: "Premium Package", discount: 0.2, minServices: 6, description: "20% off any 6 services" },
  { id: "deep", name: "Deep Clean Package", discount: 0.25, minServices: 8, description: "25% off any 8 services" },
]

const windowSizes = [
  { id: "small", name: "Small (up to 3x3 ft)", multiplier: 1 },
  { id: "medium", name: "Medium (3x3 to 4x5 ft)", multiplier: 1.5 },
  { id: "large", name: "Large (4x5+ ft)", multiplier: 2 },
]

export default function BookingPage() {
  const t = useTranslations("navigation")
  const [step, setStep] = useState(1)
  const [selectedServices, setSelectedServices] = useState<any[]>([])
  const [selectedPackage, setSelectedPackage] = useState<string>("")
  const [quote, setQuote] = useState({ subtotal: 0, discount: 0, deposit: 0, total: 0, lineItems: [] as any[] })
  const [serverQuote, setServerQuote] = useState<any>(null)
  const [priceMismatch, setPriceMismatch] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [geocoding, setGeocoding] = useState<GeocodingResult>()
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>()
  const [isOutsideServiceArea, setIsOutsideServiceArea] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ServiceBuilderForm>({
    resolver: zodResolver(serviceBuilderSchema),
    defaultValues: {
      services: [],
      customerInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
      },
    },
  })

  const calculateQuote = async (services: any[], packageId: string) => {
    setIsCalculating(true)

    const lineItems: any[] = []
    let subtotal = 0

    services.forEach((service) => {
      const serviceData = serviceCategories.flatMap((cat) => cat.services).find((s) => s.id === service.id)

      if (serviceData) {
        let price = serviceData.basePrice * service.quantity

        // Apply size multipliers
        if (service.size && serviceData.hasSizes) {
          const sizeMultiplier = windowSizes.find((s) => s.id === service.size)?.multiplier || 1
          price *= sizeMultiplier
        }

        // Frequency multipliers
        const frequencyMultipliers = {
          "one-time": 1,
          weekly: 0.9,
          "bi-weekly": 0.95,
          monthly: 1,
        }
        price *= frequencyMultipliers[service.frequency as keyof typeof frequencyMultipliers]

        lineItems.push({
          id: service.id,
          name: serviceData.name,
          quantity: service.quantity,
          unitPrice: serviceData.basePrice,
          totalPrice: price,
          frequency: service.frequency,
        })

        subtotal += price
      }
    })

    // Apply package discount
    let discount = 0
    const selectedPkg = packages.find((p) => p.id === packageId)
    if (selectedPkg && services.length >= selectedPkg.minServices) {
      discount = subtotal * selectedPkg.discount
    }

    const afterDiscount = subtotal - discount
    const deposit = afterDiscount * 0.25 // 25% deposit
    const total = afterDiscount

    const newQuote = { subtotal, discount, deposit, total, lineItems }
    setQuote(newQuote)

    // Verify with server
    try {
      const response = await fetch("/api/quote/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services, packageId, clientQuote: newQuote }),
      })
      const serverResult = await response.json()
      setServerQuote(serverResult)
      setPriceMismatch(Math.abs(serverResult.total - newQuote.total) > 0.01)
    } catch (error) {
      console.error("Quote verification failed:", error)
    }

    setIsCalculating(false)
  }

  const addService = (serviceId: string) => {
    const newService = {
      id: serviceId,
      quantity: 1,
      frequency: "one-time" as const,
      addOns: [],
    }
    const updated = [...selectedServices, newService]
    setSelectedServices(updated)
    calculateQuote(updated, selectedPackage)
  }

  const updateService = (index: number, updates: any) => {
    const updated = selectedServices.map((service, i) => (i === index ? { ...service, ...updates } : service))
    setSelectedServices(updated)
    calculateQuote(updated, selectedPackage)
  }

  const removeService = (index: number) => {
    const updated = selectedServices.filter((_, i) => i !== index)
    setSelectedServices(updated)
    calculateQuote(updated, selectedPackage)
  }

  const selectPackage = (packageId: string) => {
    setSelectedPackage(packageId)
    calculateQuote(selectedServices, packageId)
  }

  const handleAddressChange = (address: string, geocodingResult?: GeocodingResult) => {
    setValue("customerInfo.address", address)
    setGeocoding(geocodingResult)
    setIsOutsideServiceArea(geocodingResult ? !geocodingResult.isWithinServiceArea : false)
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setValue("selectedSlot", {
      id: slot.id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      estimatedDuration: slot.estimatedDuration,
    })
  }

  const onSubmit = async (data: ServiceBuilderForm) => {
    try {
      setIsCalculating(true)

      const response = await fetch("/api/bookings/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: selectedServices,
          packageId: selectedPackage,
          customerInfo: data.customerInfo,
          selectedSlot: data.selectedSlot,
          geocoding,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create order")
      }

      window.location.href = `/booking/payment?orderId=${result.order.id}&amount=${Math.round(result.depositAmount * 100)}`
    } catch (error) {
      console.error("Order creation failed:", error)
      // Handle error state
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl lg:text-6xl font-heading font-bold">Service Builder</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Build your custom cleaning service with real-time pricing
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Builder */}
      <section className="py-20">
        <div className="container max-w-6xl">
          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= stepNum ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > stepNum ? <CheckCircle className="h-5 w-5" /> : stepNum}
                  </div>
                  {stepNum < 4 && <div className={`w-16 h-1 mx-2 ${step > stepNum ? "bg-primary" : "bg-muted"}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Service Selection */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Calculator className="h-6 w-6" />
                        Select Services
                      </CardTitle>
                      <CardDescription>Choose the cleaning services you need</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {serviceCategories.map((category) => (
                        <div key={category.id} className="space-y-4">
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          <div className="grid gap-3">
                            {category.services.map((service) => (
                              <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <p className="font-medium">{service.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    ${service.basePrice} per {service.unit}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => addService(service.id)}
                                  disabled={selectedServices.some((s) => s.id === service.id)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Package Selection */}
                      <div className="space-y-4 pt-6 border-t">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Choose Package (Optional)
                        </h3>
                        <div className="grid gap-3">
                          {packages.map((pkg) => (
                            <div
                              key={pkg.id}
                              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                selectedPackage === pkg.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                              } ${selectedServices.length < pkg.minServices ? "opacity-50" : ""}`}
                              onClick={() => selectedServices.length >= pkg.minServices && selectPackage(pkg.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{pkg.name}</p>
                                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                                </div>
                                <Badge variant={selectedServices.length >= pkg.minServices ? "default" : "secondary"}>
                                  {selectedServices.length >= pkg.minServices
                                    ? "Available"
                                    : `Need ${pkg.minServices - selectedServices.length} more`}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={() => setStep(2)} disabled={selectedServices.length === 0}>
                          Configure Services
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">Configure Services</CardTitle>
                      <CardDescription>Set quantities, sizes, and frequency for each service</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <AnimatePresence>
                        {selectedServices.map((service, index) => {
                          const serviceData = serviceCategories
                            .flatMap((cat) => cat.services)
                            .find((s) => s.id === service.id)

                          return (
                            <motion.div
                              key={service.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="p-4 border rounded-lg space-y-4"
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{serviceData?.name}</h4>
                                <Button size="sm" variant="outline" onClick={() => removeService(index)}>
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Quantity</Label>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        updateService(index, { quantity: Math.max(1, service.quantity - 1) })
                                      }
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <Input
                                      type="number"
                                      value={service.quantity}
                                      onChange={(e) =>
                                        updateService(index, { quantity: Number.parseInt(e.target.value) || 1 })
                                      }
                                      className="w-20 text-center"
                                      min="1"
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateService(index, { quantity: service.quantity + 1 })}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>

                                {serviceData?.hasSizes && (
                                  <div className="space-y-2">
                                    <Label>Size</Label>
                                    <Select
                                      value={service.size || ""}
                                      onValueChange={(value) => updateService(index, { size: value })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select size" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {windowSizes.map((size) => (
                                          <SelectItem key={size.id} value={size.id}>
                                            {size.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <Label>Frequency</Label>
                                  <Select
                                    value={service.frequency}
                                    onValueChange={(value) => updateService(index, { frequency: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="one-time">One-time</SelectItem>
                                      <SelectItem value="weekly">Weekly (10% off)</SelectItem>
                                      <SelectItem value="bi-weekly">Bi-weekly (5% off)</SelectItem>
                                      <SelectItem value="monthly">Monthly</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </AnimatePresence>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(1)}>
                          Back
                        </Button>
                        <Button onClick={() => setStep(3)}>Review & Book</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">Contact & Address</CardTitle>
                      <CardDescription>Enter your contact information and service address</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input {...register("customerInfo.firstName")} />
                          {errors.customerInfo?.firstName && (
                            <p className="text-sm text-red-500">{errors.customerInfo.firstName.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input {...register("customerInfo.lastName")} />
                          {errors.customerInfo?.lastName && (
                            <p className="text-sm text-red-500">{errors.customerInfo.lastName.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input {...register("customerInfo.email")} type="email" />
                          {errors.customerInfo?.email && (
                            <p className="text-sm text-red-500">{errors.customerInfo.email.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input {...register("customerInfo.phone")} type="tel" />
                          {errors.customerInfo?.phone && (
                            <p className="text-sm text-red-500">{errors.customerInfo.phone.message}</p>
                          )}
                        </div>
                      </div>

                      <AddressInput
                        value={watch("customerInfo.address")}
                        onChange={handleAddressChange}
                        error={errors.customerInfo?.address?.message}
                        required
                      />

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(2)}>
                          Back
                        </Button>
                        <Button
                          onClick={() => setStep(4)}
                          disabled={isOutsideServiceArea || !watch("customerInfo.address")}
                        >
                          {isOutsideServiceArea ? "Contact Us Instead" : "Select Appointment Time"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="space-y-6">
                    <AvailabilityCalendar
                      services={selectedServices}
                      geocoding={geocoding}
                      onSlotSelect={handleSlotSelect}
                      selectedSlot={selectedSlot}
                    />

                    <Card>
                      <CardContent className="pt-6">
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep(3)}>
                              Back
                            </Button>
                            <Button type="submit" disabled={!selectedSlot}>
                              Complete Booking
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quote Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Live Quote
                      {isCalculating && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {priceMismatch && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Price verification in progress. Final quote may differ slightly.
                        </AlertDescription>
                      </Alert>
                    )}

                    <AnimatePresence>
                      {quote.lineItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span>${item.totalPrice.toFixed(2)}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {quote.lineItems.length > 0 && (
                      <div className="space-y-2 pt-4 border-t">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${quote.subtotal.toFixed(2)}</span>
                        </div>
                        {quote.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Package Discount</span>
                            <span>-${quote.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                          <span>Total</span>
                          <span>${quote.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Deposit (25%)</span>
                          <span>${quote.deposit.toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    {selectedServices.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">Select services to see pricing</p>
                    )}

                    {selectedSlot && (
                      <div className="space-y-2 pt-4 border-t">
                        <h4 className="font-medium text-sm">Selected Appointment</h4>
                        <div className="text-sm space-y-1">
                          <p>{new Date(selectedSlot.date).toLocaleDateString()}</p>
                          <p>
                            {selectedSlot.startTime} - {selectedSlot.endTime}
                          </p>
                          <p className="text-muted-foreground">
                            Duration: {Math.floor(selectedSlot.estimatedDuration / 60)}h{" "}
                            {selectedSlot.estimatedDuration % 60}m
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
