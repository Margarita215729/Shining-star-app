import { Suspense } from "react"
import { CustomersTable } from "@/components/admin/customers-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function AdminCustomersPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">Manage customer accounts and profiles</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span className="font-medium">Customers</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading customers...</div>}>
            <CustomersTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
