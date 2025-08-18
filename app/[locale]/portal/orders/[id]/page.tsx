"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { Calendar, User, Phone, CreditCard, MessageCircle, DollarSign, Download, Edit, RefreshCw } from "lucide-react"

export default function OrderDetailsPage() {
  const params = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`)
        const data = await response.json()
        setOrder(data.order)
      } catch (error) {
        console.error("Failed to fetch order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  if (loading) {
    return <div className="container py-20">Loading...</div>
  }

  if (!order) {
    return <div className="container py-20">Order not found</div>
  }

  return (
    <div className="container py-20 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Order #{order.id}</h1>
            <p className="text-muted-foreground">Scheduled for {new Date(order.scheduledDate).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <MessageCircle className="mr-2 h-4 w-4" />
              Message Admin
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Receipt
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant={order.status === "confirmed" ? "default" : "secondary"} className="text-sm">
                    {order.status}
                  </Badge>
                  {order.depositPaid ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Deposit Paid
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Deposit Pending</Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Scheduled Date</p>
                    <p className="font-medium">{new Date(order.scheduledDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated Duration</p>
                    <p className="font-medium">{order.estimatedDuration || "2-3 hours"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Assigned Cleaner</p>
                    <p className="font-medium">{order.assignedCleaner || "TBD"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Service Address</p>
                    <p className="font-medium">{order.address?.street || "Address on file"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">{item.serviceName}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} • {item.size || "Standard"}
                        </p>
                      </div>
                      <p className="font-medium">${item.price}</p>
                    </div>
                  )) || <p className="text-muted-foreground">Service details not available</p>}
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${order.subtotal || order.totalAmount}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${order.discount}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Deposit Paid</span>
                    <span className={order.depositPaid ? "text-green-600" : "text-red-600"}>
                      ${order.depositAmount || (order.totalAmount * 0.25).toFixed(2)}
                    </span>
                  </div>
                  {order.balanceDue > 0 && (
                    <div className="flex justify-between text-sm font-medium text-orange-600">
                      <span>Balance Due</span>
                      <span>${order.balanceDue}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.status === "completed" && (
                  <>
                    <Button className="w-full justify-start">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Add Tip
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Rebook Service
                    </Button>
                  </>
                )}
                {order.status !== "completed" && order.status !== "cancelled" && (
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Edit className="mr-2 h-4 w-4" />
                    Request Changes
                  </Button>
                )}
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message Team
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            {order.assignedCleaner && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Your Cleaner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">{order.assignedCleaner}</p>
                      <p className="text-sm text-muted-foreground">Professional Cleaner</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
