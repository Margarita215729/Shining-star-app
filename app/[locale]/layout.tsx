import { AuthProvider } from "@/components/auth-provider"
import { Footer } from "@/components/footer"
import { JsonLdSchema } from "@/components/json-ld-schema"
import { Navigation } from "@/components/navigation"
import { routing } from "@/i18n/routing"
import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import type React from "react"
import "../globals.css"

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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className="antialiased">
      <head>
        <JsonLdSchema />
        <style>{`
          html {
            --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            --font-heading: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
        `}</style>
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
