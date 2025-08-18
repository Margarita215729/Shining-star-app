"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Settings,
  CreditCard,
  FileText,
  MessageCircle,
  Download,
  DollarSign,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function PortalPage() {
  const t = useTranslations("navigation")
  const { data: session } = useSession()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders")
        const data = await response.json()
        setOrders(data.orders || [])
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchOrders()
    }
  }, [session])

  const user = {
    name: session?.user?.name || "John Smith",
    email: session?.user?.email || "john.smith@email.com",
    phone: "(215) 555-0123",
    address: "123 Main St, Philadelphia, PA 19103",
    memberSince: "2023-06-15",
    totalBookings: orders.length,
    loyaltyPoints: 450,
  }

  const upcomingBookings = orders
    .filter((order) => new Date(order.scheduledDate) > new Date() && order.status !== "cancelled")
    .slice(0, 3)

  const recentBookings = orders
    .filter((order) => order.status === "completed" || order.status === "cancelled")
    .slice(0, 3)

  const stats = [
    { label: "Total Bookings", value: user.totalBookings, icon: Calendar },
    { label: "Loyalty Points", value: user.loyaltyPoints, icon: CreditCard },
    { label: "Member Since", value: new Date(user.memberSince).getFullYear(), icon: User },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-4">Welcome back, {user.name}!</h1>
                <p className="text-xl text-muted-foreground">Manage your bookings and account settings</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message Admin
                </Button>
                <Link href="/booking">
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" />
                    New Booking
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <stat.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-20">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Bookings */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Bookings
                    </CardTitle>
                    <CardDescription>Your scheduled cleaning services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-2xl">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{booking.serviceName || "Cleaning Service"}</h3>
                              {booking.depositPaid ? (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  Deposit Paid
                                </Badge>
                              ) : (
                                <Badge variant="destructive">Deposit Pending</Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(booking.scheduledDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {booking.scheduledTime || "10:00 AM"}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {booking.assignedCleaner || "TBD"}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {booking.address?.street || "Address on file"}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="font-medium text-primary">${booking.totalAmount}</span>
                              {booking.depositPaid && booking.balanceDue > 0 && (
                                <span className="text-orange-600">Balance: ${booking.balanceDue}</span>
                              )}
                              <span className="text-muted-foreground">
                                Duration: {booking.estimatedDuration || "2-3 hours"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                              {booking.status}
                            </Badge>
                            <div className="flex gap-1">
                              <Link href={`/portal/orders/${booking.id}`}>
                                <Button variant="outline" size="sm">
                                  Details
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm">
                                <MessageCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {upcomingBookings.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No upcoming bookings</p>
                          <Link href="/booking">
                            <Button className="mt-4">Schedule Your First Cleaning</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Bookings */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Recent Bookings
                    </CardTitle>
                    <CardDescription>Your cleaning service history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-2xl">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{booking.serviceName || "Cleaning Service"}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(booking.scheduledDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {booking.assignedCleaner || "Cleaner"}
                              </div>
                              <span className="font-medium text-primary">${booking.totalAmount}</span>
                              <span className="text-xs bg-muted px-2 py-1 rounded">
                                {booking.invoiceNumber || `INV-${booking.id}`}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{booking.status}</Badge>
                            {booking.rating && (
                              <div className="flex items-center gap-1">
                                {[...Array(booking.rating)].map((_, i) => (
                                  <div key={i} className="w-3 h-3 bg-yellow-400 rounded-full" />
                                ))}
                              </div>
                            )}
                            <div className="flex gap-1">
                              <Link href={`/portal/orders/${booking.id}`}>
                                <Button variant="outline" size="sm">
                                  Receipt
                                </Button>
                              </Link>
                              {booking.status === "completed" && (
                                <>
                                  <Button variant="outline" size="sm">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    Tip
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Rebook
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {recentBookings.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No booking history yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{user.address}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/portal/profile">
                        <Button variant="outline" className="flex-1 bg-transparent">
                          <Settings className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/booking">
                      <Button className="w-full justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Cleaning
                      </Button>
                    </Link>
                    <Link href="/portal/payments">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Payment Methods
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <MapPin className="mr-2 h-4 w-4" />
                      Manage Addresses
                    </Button>
                    <Link href="/portal/profile">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Settings className="mr-2 h-4 w-4" />
                        Preferences
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Support */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Need Help?</h3>
                    <p className="text-sm opacity-90 mb-4">
                      Our customer support team is here to help with any questions or concerns.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="flex-1">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Live Chat
                      </Button>
                      <Button variant="secondary" size="sm">
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
