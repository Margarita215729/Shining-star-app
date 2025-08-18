import type React from "react"
import type { Metadata } from "next"
import { Inter, Work_Sans } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
})

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
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${inter.variable} ${workSans.variable} antialiased`}>
      <head>
        <style>{`
          html {
            --font-sans: ${inter.style.fontFamily};
            --font-heading: ${workSans.style.fontFamily};
          }
        `}</style>
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
