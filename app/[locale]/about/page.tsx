import type { Metadata } from "next"
import AboutPageClient from "./AboutPageClient"

export const metadata: Metadata = {
  title: "About Us - Shining Star Cleaning Services",
  description:
    "Learn about our professional cleaning team, our commitment to excellence, and why Philadelphia trusts us for residential and commercial cleaning services.",
}

export default function AboutPage() {
  return <AboutPageClient />
}
