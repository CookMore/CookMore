import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales } from '@/config/i18n'
import { routeConfig } from '@/lib/routes'
import { getPrivyUser } from '@/lib/auth/privy'
import { ProfileService } from '@/lib/services/profile'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Handle internationalization first
  const intlResponse = await intlMiddleware(request)

  // Skip auth checks for public routes
  if (routeConfig.public.some((route) => pathname.startsWith(route))) {
    return intlResponse
  }

  // Get auth status from Privy
  const user = await getPrivyUser()
  if (!user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Special handling for profile creation flow
  if (pathname.startsWith('/profile/create')) {
    // If user has a wallet address, check if they already have a profile
    if (user.wallet?.address) {
      const hasProfile = await ProfileService.verifyProfile(user.wallet.address)
      if (hasProfile) {
        // Redirect to profile page if they already have a profile
        return NextResponse.redirect(new URL('/profile', request.url))
      }
    }
    return intlResponse
  }

  // Check profile requirement for other protected routes
  if (routeConfig.requiresProfile.some((route) => pathname.startsWith(route))) {
    if (user.wallet?.address) {
      const hasProfile = await ProfileService.verifyProfile(user.wallet.address)
      if (!hasProfile) {
        return NextResponse.redirect(new URL('/profile/create', request.url))
      }
    } else {
      // If no wallet address, redirect to profile creation
      return NextResponse.redirect(new URL('/profile/create', request.url))
    }
  }

  // Admin route check
  if (routeConfig.adminOnly.some((route) => pathname.startsWith(route))) {
    const ADMIN_WALLET = '0x1920F5b512634DE346100b025382c04eEA8Bbc67'
    if (!user.wallet?.address || user.wallet.address.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return intlResponse
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
