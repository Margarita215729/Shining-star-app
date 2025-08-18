"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ChevronDown, HelpCircle } from "lucide-react"

export default function FAQClientPage() {
  const faqs = [
    {
      category: "General",
      questions: [
        {
          question: "What areas do you serve?",
          answer:
            "We provide cleaning services within a 10-mile radius of Philadelphia City Hall, covering most of Philadelphia and surrounding areas including Center City, South Philly, Northern Liberties, and nearby suburbs.",
        },
        {
          question: "Are you insured and bonded?",
          answer:
            "Yes, we are fully licensed, insured, and bonded. All our team members undergo background checks and are covered by comprehensive liability insurance for your peace of mind.",
        },
        {
          question: "Do I need to be home during the cleaning?",
          answer:
            "No, you don't need to be present. Many of our clients provide us with keys or access codes. We're fully insured and bonded, and all team members are background-checked for your security.",
        },
      ],
    },
    {
      category: "Pricing & Payment",
      questions: [
        {
          question: "How do you determine pricing?",
          answer:
            "Our pricing is based on the size of your space, frequency of service, and specific cleaning requirements. We offer transparent, upfront pricing with no hidden fees. Contact us for a free, personalized quote.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards, debit cards, and bank transfers. Payment is processed securely through our online booking system with a 25% deposit required to confirm your appointment.",
        },
        {
          question: "Do you offer discounts for regular service?",
          answer:
            "Yes! We offer package discounts: Basic (10% off 3+ services), Premium (20% off 6+ services), and Deep Clean (25% off 8+ services). Regular weekly or bi-weekly customers also receive preferential scheduling.",
        },
      ],
    },
    {
      category: "Services",
      questions: [
        {
          question: "What's included in a standard cleaning?",
          answer:
            "Our standard cleaning includes dusting, vacuuming, mopping, bathroom sanitization, kitchen cleaning, trash removal, and bed making. We provide detailed checklists for each room to ensure consistency.",
        },
        {
          question: "Do you bring your own supplies and equipment?",
          answer:
            "Yes, we bring all necessary cleaning supplies and professional-grade equipment. We use eco-friendly products by default, but can accommodate specific product preferences upon request.",
        },
        {
          question: "How long does a typical cleaning take?",
          answer:
            "Cleaning time varies by service type and home size. Standard residential cleanings typically take 2-4 hours, while deep cleanings can take 4-8 hours. We'll provide an estimated timeframe when you book.",
        },
      ],
    },
    {
      category: "Scheduling",
      questions: [
        {
          question: "How far in advance should I book?",
          answer:
            "We recommend booking at least 48 hours in advance, especially for weekend appointments. However, we often accommodate same-day requests based on availability.",
        },
        {
          question: "Can I reschedule or cancel my appointment?",
          answer:
            "Yes, you can reschedule or cancel up to 24 hours before your appointment without penalty. Changes made with less than 24 hours notice may incur a rescheduling fee.",
        },
        {
          question: "Do you work on weekends and holidays?",
          answer:
            "Yes, we offer services 7 days a week, including most holidays. Weekend and holiday appointments may have slightly different pricing due to increased demand.",
        },
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
              <HelpCircle className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-heading font-bold">Got Questions? We Have Answers</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Find answers to the most common questions about our cleaning services, pricing, and policies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="container max-w-4xl">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-heading font-bold mb-6 text-primary">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {faq.question}
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <h2 className="text-3xl font-heading font-bold">Still Have Questions?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Can't find what you're looking for? Our friendly team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge className="cursor-pointer hover:bg-primary/90 transition-colors px-6 py-3 text-base">
                Call (215) 555-0123
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-6 py-3 text-base"
              >
                Send us a message
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
