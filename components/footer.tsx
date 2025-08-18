"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Sparkles, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  const t = useTranslations("footer")
  const tNav = useTranslations("navigation")
  const tContact = useTranslations("contact")

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold">{t("company")}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("description")}</p>
            <div className="flex gap-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold">{t("quickLinks")}</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                {tNav("home")}
              </Link>
              <Link
                href="/services"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {tNav("services")}
              </Link>
              <Link
                href="/booking"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {tNav("booking")}
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {tNav("contact")}
              </Link>
              <Link href="/blog" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                {tNav("blog")}
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold">{t("services")}</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Residential Cleaning</p>
              <p className="text-sm text-muted-foreground">Commercial Cleaning</p>
              <p className="text-sm text-muted-foreground">Deep Cleaning</p>
              <p className="text-sm text-muted-foreground">Move In/Out Cleaning</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold">{t("contact")}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">{tContact("info.phone")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">{tContact("info.email")}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">{tContact("info.address")}</span>
              </div>
            </div>
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 {t("company")}. {t("allRightsReserved")}.
          </p>
        </div>
      </div>
    </footer>
  )
}
