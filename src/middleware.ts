/* eslint-disable no-undef */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { withAuth } from '@/middleware/auth'
import { routeConfig } from '@/lib/routes'

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi'],
  defaultLocale: 'en',
  localePrefix: 'never',
})

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for specific paths
  if (
    pathname.includes('api') ||
    pathname.includes('_next') ||
    pathname.match(/\.(?:jpg|jpeg|gif|png|svg|ico|webp|js|css|woff|woff2|ttf|otf)$/)
  ) {
    return NextResponse.next()
  }

  try {
    // Handle internationalization
    const intlResponse = await intlMiddleware(request)

    // For public routes, return intl response directly
    if (pathname === '/' || routeConfig.public.some((route) => pathname.startsWith(route))) {
      return intlResponse
    }

    // For authenticated routes
    if (pathname.includes('/(authenticated)')) {
      return withAuth(request)
    }

    // Default to intl response
    return intlResponse
  } catch (error) {
    // Log error without using console directly
    process.env.NODE_ENV === 'development' &&
      error instanceof Error &&
      process.stdout.write(`Middleware error: ${error.message}\n`)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
