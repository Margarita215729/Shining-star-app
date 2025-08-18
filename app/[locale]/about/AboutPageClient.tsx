"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Users, Award, Clock, Shield } from "lucide-react"

export default function AboutPageClient() {
  const t = useTranslations("about")

  const values = [
    {
      icon: Shield,
      title: "Trust & Reliability",
      description: "Fully insured, bonded, and background-checked professionals you can trust in your space.",
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description: "We maintain the highest standards with detailed checklists and quality assurance protocols.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your satisfaction is our priority. We listen, adapt, and exceed expectations every time.",
    },
    {
      icon: Clock,
      title: "Punctual Service",
      description: "Reliable scheduling and on-time arrival because we respect your valuable time.",
    },
  ]

  const stats = [
    { number: "5000+", label: "Happy Customers" },
    { number: "15+", label: "Years Experience" },
    { number: "50+", label: "Team Members" },
    { number: "4.9", label: "Average Rating" },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="w-fit mx-auto">
              About Shining Star
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-heading font-bold">
              Philadelphia's Most Trusted Cleaning Service
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              For over 15 years, we've been transforming homes and businesses across Philadelphia with our commitment to
              excellence, reliability, and customer satisfaction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-heading font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl lg:text-4xl font-heading font-bold">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2009 by Maria Rodriguez, Shining Star began as a small family business with a simple
                  mission: to provide Philadelphia families with reliable, high-quality cleaning services they could
                  trust.
                </p>
                <p>
                  What started as a one-person operation has grown into Philadelphia's premier cleaning service, with
                  over 50 trained professionals serving thousands of satisfied customers across the greater Philadelphia
                  area.
                </p>
                <p>
                  Today, we continue to uphold the same values that built our reputation: attention to detail,
                  reliability, and treating every home and business as if it were our own.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img src="/professional-cleaning-team.png" alt="Our cleaning team" className="rounded-2xl shadow-lg" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{value.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
