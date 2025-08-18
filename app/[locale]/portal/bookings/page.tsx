"use client"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, User, ArrowLeft, Star, MessageCircle, CreditCard } from "lucide-react"
import Link from "next/link"

export default function BookingsPage() {
  const t = useTranslations("navigation")

  const upcomingBookings = [
    {
      id: 1,
      service: "Residential Cleaning",
      date: "2024-01-20",
      time: "10:00 AM",
      status: "confirmed",
      cleaner: "Maria Rodriguez",
      address: "123 Main St, Philadelphia, PA",
      price: 120,
      duration: "2-3 hours",
      notes: "Regular weekly cleaning",
    },
    {
      id: 2,
      service: "Deep Cleaning",
      date: "2024-02-15",
      time: "9:00 AM",
      status: "pending",
      cleaner: "TBD",
      address: "123 Main St, Philadelphia, PA",
      price: 250,
      duration: "4-5 hours",
      notes: "Spring deep clean",
    },
  ]

  const pastBookings = [
    {
      id: 3,
      service: "Residential Cleaning",
      date: "2024-01-05",
      status: "completed",
      rating: 5,
      cleaner: "Sarah Johnson",
      price: 120,
      invoice: "INV-2024-001",
      address: "123 Main St, Philadelphia, PA",
      duration: "2 hours",
      review: "Excellent service! Very thorough and professional.",
    },
    {
      id: 4,
      service: "Move Out Cleaning",
      date: "2023-12-20",
      status: "completed",
      rating: 5,
      cleaner: "Mike Chen",
      price: 300,
      invoice: "INV-2023-045",
      address: "456 Oak Ave, Philadelphia, PA",
      duration: "4 hours",
      review: "Perfect move-out cleaning. Got my full deposit back!",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-6">
              <Link href="/portal">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Portal
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">My Bookings</h1>
            <p className="text-lg text-muted-foreground">Manage your cleaning service appointments</p>
          </motion.div>
        </div>
      </section>

      {/* Bookings Content */}
      <section className="py-12">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Tabs defaultValue="upcoming" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
                <TabsTrigger value="past">Past Bookings ({pastBookings.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{booking.service}</h3>
                          <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">${booking.price}</p>
                          <p className="text-sm text-muted-foreground">{booking.duration}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{booking.time}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4" />
                            <span>{booking.cleaner}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.address}</span>
                          </div>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mb-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm">
                            <strong>Notes:</strong> {booking.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Contact Cleaner
                        </Button>
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {pastBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{booking.service}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{booking.status}</Badge>
                            <div className="flex items-center gap-1">
                              {[...Array(booking.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">${booking.price}</p>
                          <p className="text-sm text-muted-foreground">{booking.duration}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4" />
                            <span>{booking.cleaner}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CreditCard className="h-4 w-4" />
                            <span>{booking.invoice}</span>
                          </div>
                        </div>
                      </div>

                      {booking.review && (
                        <div className="mb-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm">
                            <strong>Your Review:</strong> {booking.review}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Invoice
                        </Button>
                        <Button variant="outline" size="sm">
                          Book Again
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
