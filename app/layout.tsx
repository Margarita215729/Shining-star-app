import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Shining Star Cleaning Services - Professional Cleaning in Philadelphia",
  description:
    "Premium residential and commercial cleaning services in Philadelphia and surrounding areas. Trusted, reliable, and professional cleaning solutions.",
  generator: "Next.js",
  keywords: [
    "cleaning services",
    "Philadelphia",
    "residential cleaning",
    "commercial cleaning",
    "house cleaning",
    "office cleaning",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
