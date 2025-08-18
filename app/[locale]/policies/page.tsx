import type { Metadata } from "next"
import PoliciesClient from "./PoliciesClient"

export const metadata: Metadata = {
  title: "Policies & Terms - Shining Star Cleaning Services",
  description:
    "Review our service policies, terms of service, privacy policy, and cancellation policies for transparent and reliable cleaning services.",
}

export default function PoliciesPage() {
  return <PoliciesClient />
}
