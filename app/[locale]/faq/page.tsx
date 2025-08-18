import type { Metadata } from "next"
import FAQClientPage from "./FAQClientPage"

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | Shining Star Cleaning",
  description: "Find answers to common questions about our cleaning services, pricing, scheduling, and policies.",
}

export default function FAQPage() {
  return <FAQClientPage />
}
