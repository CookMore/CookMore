import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'
import { withApiMiddleware } from './app/api/middleware'

// Create intl middleware instance
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
})

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Handle API routes with API middleware
  if (pathname.startsWith('/api')) {
    return withApiMiddleware(request)
  }

  // Skip middleware for static files
  if (
    pathname.includes('_next') ||
    pathname.match(/\.(?:jpg|jpeg|gif|png|svg|ico|webp|js|css|woff|woff2|ttf|otf)$/)
  ) {
    return NextResponse.next()
  }

  try {
    // Handle internationalization
    const response = await intlMiddleware(request)

    // Add security headers
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url))
  }
}

export const config = {
  // Matcher ignoring _next and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
