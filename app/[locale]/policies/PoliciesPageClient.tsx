"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Shield, FileText, Clock, CreditCard } from "lucide-react"

export default function PoliciesPageClient() {
  const policies = [
    {
      icon: Shield,
      title: "Privacy Policy",
      content: [
        "We respect your privacy and are committed to protecting your personal information.",
        "We collect only necessary information to provide our services effectively.",
        "Your data is never shared with third parties without your explicit consent.",
        "We use industry-standard security measures to protect your information.",
        "You have the right to access, modify, or delete your personal data at any time.",
      ],
    },
    {
      icon: FileText,
      title: "Terms of Service",
      content: [
        "Services are provided by licensed, insured, and bonded professionals.",
        "All estimates are valid for 30 days from the date of issue.",
        "We reserve the right to refuse service in unsafe or inappropriate conditions.",
        "Customers are responsible for securing valuable items before service.",
        "Any damages caused by our negligence will be covered by our insurance.",
      ],
    },
    {
      icon: Clock,
      title: "Cancellation Policy",
      content: [
        "Appointments can be cancelled or rescheduled up to 24 hours in advance.",
        "Cancellations with less than 24 hours notice may incur a $25 fee.",
        "Same-day cancellations are subject to a 50% service charge.",
        "Weather-related cancellations are handled on a case-by-case basis.",
        "We offer flexible rescheduling for emergency situations.",
      ],
    },
    {
      icon: CreditCard,
      title: "Payment Policy",
      content: [
        "A 25% deposit is required to confirm your booking.",
        "Final payment is due upon completion of service.",
        "We accept all major credit cards and bank transfers.",
        "Invoices are sent electronically and payment is processed securely.",
        "Late payments may incur a 1.5% monthly service charge.",
      ],
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
            className="text-center space-y-8 max-w-3xl mx-auto"
          >
            <Badge variant="secondary" className="w-fit mx-auto">
              <FileText className="w-4 h-4 mr-2" />
              Policies & Terms
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-heading font-bold">Our Policies & Terms</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Transparent policies that protect both our customers and our team, ensuring reliable and professional
              service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Policies Content */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8">
            {policies.map((policy, index) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <policy.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{policy.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {policy.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-muted-foreground leading-relaxed">
                          • {item}
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

      {/* Additional Information */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-heading font-bold text-center">Additional Information</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Service Guarantee</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    We stand behind our work with a 100% satisfaction guarantee. If you're not completely satisfied with
                    our service, we'll return within 24 hours to make it right at no additional charge.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Insurance & Liability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    We carry comprehensive general liability insurance and workers' compensation coverage. All team
                    members are bonded and background-checked for your security and peace of mind.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For questions about our policies or to discuss specific needs, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Phone:</strong> (215) 555-0123
                  </p>
                  <p>
                    <strong>Email:</strong> info@shiningstarphilly.com
                  </p>
                  <p>
                    <strong>Address:</strong> 123 Market Street, Philadelphia, PA 19107
                  </p>
                  <p>
                    <strong>Business Hours:</strong> Monday - Sunday, 7:00 AM - 7:00 PM
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
