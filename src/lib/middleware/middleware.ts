import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routeConfig } from '../routes'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get auth token from cookies
  const isAuthenticated = request.cookies.has('privy-token')

  // Get profile status from cookies or headers
  const hasProfile = request.cookies.has('profile-token')

  // Check admin status - using the same wallet check as header
  const ADMIN_WALLET = '0x1920F5b512634DE346100b025382c04eEA8Bbc67'
  const walletAddress = request.cookies.get('wallet-address')?.value
  const isAdmin = walletAddress?.toLowerCase() === ADMIN_WALLET.toLowerCase()

  // Clear response to prevent caching issues
  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'no-store, must-revalidate')

  // Public routes are always accessible
  if (routeConfig.public.includes(pathname)) {
    return response
  }

  // Handle profile creation separately
  if (pathname === routeConfig.special.profileCreate) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return response
  }

  // Check authentication for protected routes
  if (routeConfig.protected.includes(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Check profile requirement
  if (routeConfig.requiresProfile.includes(pathname) && !hasProfile) {
    return NextResponse.redirect(new URL(routeConfig.special.profileCreate, request.url))
  }

  // Check admin access
  if (routeConfig.adminOnly.includes(pathname) && !isAdmin) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons|sw.js|workbox-).*)',
    '/',
  ],
}
