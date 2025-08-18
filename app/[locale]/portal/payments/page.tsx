"use client"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { CreditCard, Download, ArrowLeft, Plus, Trash2, Calendar } from "lucide-react"
import Link from "next/link"

export default function PaymentsPage() {
  const t = useTranslations("navigation")

  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "5555",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    },
  ]

  const invoices = [
    {
      id: "INV-2024-001",
      date: "2024-01-05",
      service: "Residential Cleaning",
      amount: 120,
      status: "paid",
      dueDate: "2024-01-05",
      paymentMethod: "Visa ****4242",
    },
    {
      id: "INV-2023-045",
      date: "2023-12-20",
      service: "Move Out Cleaning",
      amount: 300,
      status: "paid",
      dueDate: "2023-12-20",
      paymentMethod: "Visa ****4242",
    },
    {
      id: "INV-2023-044",
      date: "2023-12-15",
      service: "Residential Cleaning",
      amount: 120,
      status: "paid",
      dueDate: "2023-12-15",
      paymentMethod: "Mastercard ****5555",
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
            <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">Payments & Billing</h1>
            <p className="text-lg text-muted-foreground">Manage your payment methods and view invoices</p>
          </motion.div>
        </div>
      </section>

      {/* Payments Content */}
      <section className="py-12">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Tabs defaultValue="methods" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="methods">Payment Methods</TabsTrigger>
                <TabsTrigger value="invoices">Invoices & History</TabsTrigger>
              </TabsList>

              <TabsContent value="methods" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Payment Methods</h2>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>

                <div className="grid gap-4">
                  {paymentMethods.map((method) => (
                    <Card key={method.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <CreditCard className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {method.type} ending in {method.last4}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Expires {method.expiryMonth}/{method.expiryYear}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {method.isDefault && <Badge variant="default">Default</Badge>}
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="invoices" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Invoice History</h2>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download All
                  </Button>
                </div>

                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <Card key={invoice.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold">{invoice.id}</h3>
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                {invoice.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{invoice.service}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(invoice.date).toLocaleDateString()}
                              </div>
                              <span>Paid with {invoice.paymentMethod}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">${invoice.amount}</p>
                            <div className="flex gap-2 mt-2">
                              <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
