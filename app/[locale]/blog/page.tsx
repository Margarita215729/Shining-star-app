"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Calendar, Clock, ArrowRight } from "lucide-react"

export default function BlogPage() {
  const t = useTranslations("navigation")

  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Cleaning Tips for a Spotless Home",
      excerpt:
        "Discover professional cleaning secrets that will transform your home maintenance routine and keep every room sparkling clean.",
      category: "Home Tips",
      date: "2024-01-15",
      readTime: "5 min read",
      image: "/clean-organized-home.png",
    },
    {
      id: 2,
      title: "The Benefits of Professional Commercial Cleaning",
      excerpt:
        "Learn how professional cleaning services can improve workplace productivity, employee health, and your business image.",
      category: "Business",
      date: "2024-01-10",
      readTime: "7 min read",
      image: "/clean-modern-office.png",
    },
    {
      id: 3,
      title: "Eco-Friendly Cleaning: Better for You and the Environment",
      excerpt:
        "Explore sustainable cleaning practices and products that protect your family's health while caring for our planet.",
      category: "Green Living",
      date: "2024-01-05",
      readTime: "6 min read",
      image: "/eco-friendly-cleaning.png",
    },
    {
      id: 4,
      title: "Spring Cleaning Checklist: Room by Room Guide",
      excerpt:
        "A comprehensive guide to deep cleaning every room in your home this spring, with professional tips and time-saving strategies.",
      category: "Seasonal",
      date: "2024-01-01",
      readTime: "10 min read",
      image: "/placeholder-f2vhv.png",
    },
    {
      id: 5,
      title: "How Often Should You Deep Clean Your Home?",
      excerpt:
        "Understanding the optimal cleaning schedule for different areas of your home to maintain a healthy living environment.",
      category: "Home Tips",
      date: "2023-12-28",
      readTime: "4 min read",
      image: "/home-deep-cleaning.png",
    },
    {
      id: 6,
      title: "Preparing Your Home for Professional Cleaning",
      excerpt:
        "Simple steps to prepare your space before our cleaning team arrives to ensure the most efficient and thorough service.",
      category: "Service Tips",
      date: "2023-12-25",
      readTime: "3 min read",
      image: "/prepared-home-cleaning.png",
    },
  ]

  const categories = ["All", "Home Tips", "Business", "Green Living", "Seasonal", "Service Tips"]

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
            <h1 className="text-4xl lg:text-6xl font-heading font-bold">Cleaning Tips & Insights</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Expert advice, cleaning tips, and industry insights to help you maintain a cleaner, healthier space.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="container">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "All" ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow group">
                  <div className="aspect-video overflow-hidden rounded-t-2xl">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                    <CardDescription className="text-base">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-muted-foreground mb-4">Showing 6 of 24 articles</p>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-6 py-2"
              >
                Load More Articles
              </Badge>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-8 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold">Stay Updated with Cleaning Tips</h2>
            <p className="text-xl text-muted-foreground">
              Get the latest cleaning tips, seasonal guides, and exclusive offers delivered to your inbox monthly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-2xl border border-border bg-background"
              />
              <Badge className="cursor-pointer hover:bg-primary/90 transition-colors px-6 py-2 whitespace-nowrap">
                Subscribe
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
