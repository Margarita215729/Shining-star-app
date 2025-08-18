export function JsonLdSchema() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://shiningstarphilly.com",
    name: "Shining Star Cleaning Services",
    description: "Professional residential and commercial cleaning services in Philadelphia and surrounding areas.",
    url: "https://shiningstarphilly.com",
    telephone: "+1-215-555-0123",
    email: "info@shiningstarphilly.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Market Street",
      addressLocality: "Philadelphia",
      addressRegion: "PA",
      postalCode: "19107",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 39.9526,
      longitude: -75.1652,
    },
    openingHours: "Mo-Su 07:00-19:00",
    priceRange: "$$",
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 39.9526,
        longitude: -75.1652,
      },
      geoRadius: "10 miles",
    },
    serviceType: ["Residential Cleaning", "Commercial Cleaning", "Deep Cleaning", "Move In/Out Cleaning"],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "500",
    },
  }

  const services = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Professional Cleaning Services",
    description: "Comprehensive cleaning solutions for homes and businesses",
    provider: {
      "@type": "LocalBusiness",
      name: "Shining Star Cleaning Services",
    },
    areaServed: "Philadelphia, PA",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cleaning Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Residential Cleaning",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Commercial Cleaning",
          },
        },
      ],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(services) }} />
    </>
  )
}
