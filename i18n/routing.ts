import { defineRouting } from "next-intl/routing"
import { createSharedPathnamesNavigation } from "next-intl/navigation"

export const routing = defineRouting({
  locales: ["en", "es", "ru", "uk", "kk"],
  defaultLocale: "en",
  pathnames: {
    "/": "/",
    "/services": {
      en: "/services",
      es: "/servicios",
      ru: "/uslugi",
      uk: "/poslugy",
      kk: "/qyzmetler",
    },
    "/booking": {
      en: "/booking",
      es: "/reserva",
      ru: "/zapis",
      uk: "/zapys",
      kk: "/brondau",
    },
    "/contact": {
      en: "/contact",
      es: "/contacto",
      ru: "/kontakt",
      uk: "/kontakt",
      kk: "/baylanys",
    },
    "/blog": {
      en: "/blog",
      es: "/blog",
      ru: "/blog",
      uk: "/blog",
      kk: "/blog",
    },
    "/portal": {
      en: "/portal",
      es: "/portal",
      ru: "/portal",
      uk: "/portal",
      kk: "/portal",
    },
    "/admin": {
      en: "/admin",
      es: "/admin",
      ru: "/admin",
      uk: "/admin",
      kk: "/admin",
    },
  },
})

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation(routing)
