import createMiddleware from "next-intl/middleware"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { routing } from "./i18n/routing"

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing)

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Apply internationalization middleware first
  const intlResponse = intlMiddleware(request)

  // Get the session token from cookies
  const sessionToken = request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token")

  const isLoggedIn = !!sessionToken

  // Extract locale from pathname
  const locale = pathname.split('/')[1]
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

  // Protected admin routes
  if (pathWithoutLocale.startsWith("/admin") && !pathWithoutLocale.startsWith("/admin/setup")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(`/${locale}/auth/signin`, request.url))
    }
  }

  // Protected portal routes
  if (pathWithoutLocale.startsWith("/portal")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(`/${locale}/auth/signin`, request.url))
    }
  }

  // Redirect logged-in users away from auth pages
  if (pathWithoutLocale.startsWith("/auth/") && isLoggedIn) {
    return NextResponse.redirect(new URL(`/${locale}/portal`, request.url))
  }

  // Return the intl response if it's not a redirect, otherwise continue
  return intlResponse || NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)"],
}
