"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, MessageSquare, Calendar, DollarSign } from "lucide-react"
import { toast } from "sonner"

interface Order {
  id: string
  customerName: string
  customerEmail: string
  services: string[]
  totalAmount: number
  depositPaid: boolean
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
  scheduledDate: string
  createdAt: string
}

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders")
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      toast.error("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus as any } : order)))

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        fetchOrders()
        throw new Error("Failed to update order")
      }

      toast.success("Order status updated")
    } catch (error) {
      toast.error("Failed to update order status")
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading orders...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Services</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Scheduled</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-sm">{order.id.slice(-8)}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{order.customerName}</div>
                  <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {order.services.slice(0, 2).map((service, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                  {order.services.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{order.services.length - 2} more
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant={order.depositPaid ? "default" : "destructive"}>
                    {order.depositPaid ? "Deposit Paid" : "Pending"}
                  </Badge>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
              </TableCell>
              <TableCell>
                <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {order.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString() : "Not scheduled"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
