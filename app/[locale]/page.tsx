"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Home, Building2, Sparkles, ArrowRight, CheckCircle, Star, Phone, Clock, Shield, Users } from "lucide-react"

export default function HomePage() {
  const t = useTranslations("hero")
  const tServices = useTranslations("services")
  const tContact = useTranslations("contact")

  const services = [
    {
      icon: Home,
      title: tServices("residential.title"),
      description: tServices("residential.description"),
      features: ["Weekly/Bi-weekly", "Deep Clean", "Eco-friendly"],
    },
    {
      icon: Building2,
      title: tServices("commercial.title"),
      description: tServices("commercial.description"),
      features: ["Office Buildings", "Retail Spaces", "Medical Facilities"],
    },
    {
      icon: Sparkles,
      title: tServices("deep.title"),
      description: tServices("deep.description"),
      features: ["Move-in Ready", "Post-Construction", "Spring Cleaning"],
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "Insured & Bonded",
      description: "Fully licensed and insured for your peace of mind",
    },
    {
      icon: Users,
      title: "Trained Professionals",
      description: "Background-checked and experienced cleaning staff",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Available 7 days a week to fit your schedule",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  Philadelphia's #1 Cleaning Service
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-heading font-bold leading-tight">{t("title")}</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">{t("subtitle")}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/booking">
                    {t("cta")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                  <Link href="/services">{t("ctaSecondary")}</Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="font-medium">{tContact("info.phone")}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">4.9/5 Rating</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8">
                <img
                  src="/professional-cleaning-team.png"
                  alt="Professional cleaning team"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-heading font-bold">{tServices("title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional cleaning solutions tailored to your specific needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
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

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-3xl lg:text-5xl font-heading font-bold">Ready for a Spotless Space?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of satisfied customers in Philadelphia. Get your free quote today!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link href="/booking">
                {t("cta")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
