"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Home, Building2, Sparkles, Truck, CheckCircle, ArrowRight, Clock, DollarSign, Users } from "lucide-react"

export default function ServicesPage() {
  const t = useTranslations("services")
  const tHero = useTranslations("hero")

  const services = [
    {
      icon: Home,
      title: t("residential.title"),
      description: t("residential.description"),
      features: [
        "Regular weekly/bi-weekly cleaning",
        "Kitchen and bathroom deep clean",
        "Dusting and vacuuming",
        "Floor mopping and sanitizing",
        "Trash removal and bed making",
      ],
      pricing: "Starting at $80",
      duration: "2-4 hours",
      image: "/clean-modern-interior.png",
    },
    {
      icon: Building2,
      title: t("commercial.title"),
      description: t("commercial.description"),
      features: [
        "Office buildings and workspaces",
        "Retail stores and showrooms",
        "Medical and dental facilities",
        "Restaurant and food service",
        "Post-construction cleanup",
      ],
      pricing: "Custom quote",
      duration: "Flexible",
      image: "/clean-modern-office.png",
    },
    {
      icon: Sparkles,
      title: t("deep.title"),
      description: t("deep.description"),
      features: [
        "Inside appliances and cabinets",
        "Baseboards and window sills",
        "Light fixtures and ceiling fans",
        "Behind furniture cleaning",
        "Detailed bathroom sanitization",
      ],
      pricing: "Starting at $200",
      duration: "4-8 hours",
      image: "/deep-cleaning-process.png",
    },
    {
      icon: Truck,
      title: t("moveInOut.title"),
      description: t("moveInOut.description"),
      features: [
        "Complete empty home cleaning",
        "Cabinet and drawer interiors",
        "Appliance deep cleaning",
        "Window and blind cleaning",
        "Final walkthrough inspection",
      ],
      pricing: "Starting at $300",
      duration: "6-10 hours",
      image: "/empty-house-cleaning.png",
    },
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
              Professional Cleaning Services
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-heading font-bold">{t("title")}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              From regular maintenance to deep cleaning, we provide comprehensive solutions for homes and businesses
              throughout Philadelphia.
            </p>
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/booking">
                {tHero("cta")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container">
          <div className="space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden">
                  <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}>
                    <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        className="w-full h-64 lg:h-full object-cover"
                      />
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <CardHeader className="p-0 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                          <service.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl lg:text-3xl">{service.title}</CardTitle>
                        <CardDescription className="text-lg">{service.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="p-0 space-y-6">
                        <ul className="space-y-3">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap gap-4 pt-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span className="font-medium">{service.pricing}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium">{service.duration}</span>
                          </div>
                        </div>

                        <Button asChild className="w-fit">
                          <Link href="/booking">Book This Service</Link>
                        </Button>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-heading font-bold">Why Choose Shining Star?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're committed to delivering exceptional cleaning services that exceed your expectations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Experienced Team",
                description:
                  "Our trained professionals have years of experience in residential and commercial cleaning",
              },
              {
                icon: CheckCircle,
                title: "Quality Guarantee",
                description: "We stand behind our work with a 100% satisfaction guarantee on every service",
              },
              {
                icon: Clock,
                title: "Flexible Scheduling",
                description: "Available 7 days a week with flexible scheduling to fit your busy lifestyle",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
