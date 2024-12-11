import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { withAuth } from './auth'
import { routeConfig } from '@/lib/routes'
import { locales, defaultLocale } from '@/config/i18n'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
})

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for static files
  if (
    pathname.includes('api') ||
    pathname.includes('_next') ||
    pathname.match(/\.(?:jpg|jpeg|gif|png|svg|ico|webp|js|css|woff|woff2|ttf|otf)$/)
  ) {
    return NextResponse.next()
  }

  // Redirect root to locale path
  if (pathname === '/') {
    const locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  try {
    // Handle internationalization
    const intlResponse = await intlMiddleware(request)

    // For public routes, return intl response directly
    if (routeConfig.public.some((route) => pathname.startsWith(route))) {
      return intlResponse
    }

    // For authenticated routes
    if (pathname.includes('/(authenticated)')) {
      // Check if route requires profile
      if (routeConfig.requiresProfile.some((route) => pathname.startsWith(route))) {
        return withAuth(request, { requireProfile: true })
      }

      // Check if route is admin only
      if (routeConfig.adminOnly.some((route) => pathname.startsWith(route))) {
        return withAuth(request, { requireAdmin: true })
      }

      return withAuth(request)
    }

    return intlResponse
  } catch (error) {
    if (process.env.NODE_ENV === 'development' && error instanceof Error) {
      process.stdout.write(`Middleware error: ${error.message}\n`)
    }
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
