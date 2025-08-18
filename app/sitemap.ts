import type { MetadataRoute } from "next/dist/lib/metadata/types/metadata-interface"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shiningstarphilly.com"
  const locales = ["en", "es", "ru", "uk", "kk"]

  const routes = ["", "/services", "/booking", "/contact", "/blog", "/about", "/faq", "/policies"]

  const sitemap: MetadataRoute.Sitemap = []

  // Add routes for each locale
  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "/blog" ? "weekly" : "monthly",
        priority: route === "" ? 1 : route === "/services" || route === "/booking" ? 0.9 : 0.7,
      })
    })
  })

  return sitemap
}
