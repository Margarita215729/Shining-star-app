import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Protected admin routes
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/setup")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    // Check if user has admin role
    if (req.auth?.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Protected portal routes
  if (pathname.startsWith("/portal")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }
  }

  // Redirect logged-in users away from auth pages
  if (pathname.startsWith("/auth/") && isLoggedIn) {
    return NextResponse.redirect(new URL("/portal", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)"],
}
