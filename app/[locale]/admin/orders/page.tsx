import { Suspense } from "react"
import { OrdersTable } from "@/components/admin/orders-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"

export default function AdminOrdersPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">View and manage all customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <span className="font-medium">Orders</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading orders...</div>}>
            <OrdersTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
