import { getTranslations } from "next-intl/server"

export async function getT(namespace?: string) {
  return await getTranslations(namespace)
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

export function getServiceRadius(): number {
  return Number.parseInt(process.env.SERVICE_RADIUS_MILES || "10")
}

export function getServiceCenter(): { lat: number; lon: number } {
  return {
    lat: Number.parseFloat(process.env.NEXT_PUBLIC_SERVICE_CENTER_LAT || "39.9526"),
    lon: Number.parseFloat(process.env.NEXT_PUBLIC_SERVICE_CENTER_LON || "-75.1652"),
  }
}
