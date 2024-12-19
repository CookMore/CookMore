import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'
import { withAuth } from './app/api/middleware/auth'

// Create intl middleware instance
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
})

function addSecurityHeaders(response: NextResponse) {
  // Add security headers
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  return response
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for static files
  if (
    pathname.includes('_next') ||
    pathname.match(/\.(?:jpg|jpeg|gif|png|svg|ico|webp|js|css|woff|woff2|ttf|otf)$/)
  ) {
    return addSecurityHeaders(NextResponse.next())
  }

  try {
    // Get current locale from path or use default
    const pathSegments = pathname.split('/')
    const currentLocale = locales.includes(pathSegments[1] as any) ? pathSegments[1] : defaultLocale

    // Handle internationalization first
    const intlResponse = await intlMiddleware(request)

    // Special handling for profile creation
    if (pathname.includes('/profile/create')) {
      const authResponse = await withAuth(request, { currentLocale, requireProfile: false })

      // If auth redirects, preserve the locale
      const redirectLocation = authResponse.headers.get('Location')
      if (redirectLocation) {
        const redirectUrl = new URL(redirectLocation, request.url)
        redirectUrl.pathname = `/${currentLocale}${redirectUrl.pathname}`
        return addSecurityHeaders(NextResponse.redirect(redirectUrl))
      }

      return addSecurityHeaders(authResponse)
    }

    // Handle auth for authenticated routes
    if (pathname.includes('/(authenticated)') || pathname.startsWith('/profile')) {
      const authResponse = await withAuth(request, { currentLocale })

      // If auth redirects, preserve the locale
      const redirectLocation = authResponse.headers.get('Location')
      if (redirectLocation) {
        const redirectUrl = new URL(redirectLocation, request.url)
        redirectUrl.pathname = `/${currentLocale}${redirectUrl.pathname}`
        return addSecurityHeaders(NextResponse.redirect(redirectUrl))
      }

      return addSecurityHeaders(authResponse)
    }

    return addSecurityHeaders(intlResponse)
  } catch (error) {
    console.error('Middleware error:', error)
    return addSecurityHeaders(NextResponse.redirect(new URL(`/${defaultLocale}`, request.url)))
  }
}

export const config = {
  // Matcher ignoring _next and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
