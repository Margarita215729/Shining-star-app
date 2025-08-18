import type { MetadataRoute } from "next/dist/lib/metadata/types/metadata-interface"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shiningstarphilly.com"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/portal/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
