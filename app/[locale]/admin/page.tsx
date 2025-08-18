"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Settings, Users, Calendar, DollarSign, BarChart3, FileText, Shield, Wrench } from "lucide-react"

export default function AdminPage() {
  const t = useTranslations("navigation")

  const stats = [
    {
      title: "Total Bookings",
      value: "1,234",
      change: "+12%",
      icon: Calendar,
    },
    {
      title: "Active Customers",
      value: "856",
      change: "+8%",
      icon: Users,
    },
    {
      title: "Monthly Revenue",
      value: "$45,678",
      change: "+15%",
      icon: DollarSign,
    },
    {
      title: "Completion Rate",
      value: "98.5%",
      change: "+2%",
      icon: BarChart3,
    },
  ]

  const quickActions = [
    {
      title: "Setup Wizard",
      description: "Configure environment variables and system settings",
      icon: Wrench,
      href: "/admin/setup",
      variant: "default" as const,
    },
    {
      title: "Manage Bookings",
      description: "View and manage customer bookings",
      icon: Calendar,
      href: "/admin/bookings",
      variant: "outline" as const,
    },
    {
      title: "Customer Management",
      description: "View customer profiles and history",
      icon: Users,
      href: "/admin/customers",
      variant: "outline" as const,
    },
    {
      title: "Financial Reports",
      description: "Revenue, payments, and financial analytics",
      icon: DollarSign,
      href: "/admin/reports",
      variant: "outline" as const,
    },
    {
      title: "System Settings",
      description: "Configure application settings",
      icon: Settings,
      href: "/admin/settings",
      variant: "outline" as const,
    },
    {
      title: "User Permissions",
      description: "Manage admin users and permissions",
      icon: Shield,
      href: "/admin/users",
      variant: "outline" as const,
    },
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
                <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-4">Admin Dashboard</h1>
                <p className="text-xl text-muted-foreground">Manage your cleaning service business</p>
              </div>
              <Badge variant="secondary" className="px-4 py-2">
                Administrator
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-20">
        <div className="container max-w-6xl">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-green-600">{stat.change} from last month</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-heading font-bold mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <action.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant={action.variant} className="w-full">
                        <Link href={action.href}>{action.title === "Setup Wizard" ? "Configure System" : "Open"}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest system activities and bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "New booking created",
                      user: "John Smith",
                      time: "2 minutes ago",
                      type: "booking",
                    },
                    {
                      action: "Payment received",
                      user: "Sarah Johnson",
                      time: "15 minutes ago",
                      type: "payment",
                    },
                    {
                      action: "Service completed",
                      user: "Mike Chen",
                      time: "1 hour ago",
                      type: "completion",
                    },
                    {
                      action: "New customer registered",
                      user: "Emma Wilson",
                      time: "2 hours ago",
                      type: "registration",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-2xl">
                      <div className="space-y-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">by {activity.user}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">
                          {activity.type}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
