import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

export default getRequestConfig(async ({ locale }) => {
  if (!routing.locales.includes(locale as any)) {
    return { 
      locale: "en" as const,
      messages: {} 
    }
  }

  return {
    locale: locale as string,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
