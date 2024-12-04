import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get auth token from cookies
  const hasAuthToken = request.cookies.has('privy-token')

  // Clear response to prevent caching issues
  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'no-store, must-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')

  // Get the current path
  const { pathname } = request.nextUrl

  console.log('Middleware Check:', {
    pathname,
    hasAuthToken,
    cookies: request.cookies.getAll(),
  })

  // Protected routes that require authentication
  const protectedRoutes = ['/kitchen', '/app', '/profile']
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Marketing routes
  const marketingRoutes = ['/', '/features', '/pricing', '/explore', '/club']
  const isMarketingRoute = marketingRoutes.includes(pathname)

  // Special case for profile creation
  const isProfileCreate = pathname.startsWith('/profile/create')

  if (isProtectedRoute && !hasAuthToken && !isProfileCreate) {
    // Redirect to home if trying to access protected routes while not authenticated
    console.log('Redirecting to home: No auth token')
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Don't redirect from marketing routes even if authenticated
  // Let the client handle profile NFT check and appropriate routing
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons|sw.js|workbox-).*)',
    '/',
  ],
}
