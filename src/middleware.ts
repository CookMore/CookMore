import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'
import { withAuth } from './app/api/middleware/auth'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

function addSecurityHeaders(response: NextResponse) {
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  return response
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for static files and API routes
  if (
    pathname.includes('_next') ||
    pathname.match(/\.(?:jpg|jpeg|gif|png|svg|ico|webp|js|css|woff|woff2|ttf|otf)$/) ||
    pathname.startsWith('/api/')
  ) {
    return addSecurityHeaders(NextResponse.next())
  }

  try {
    // Apply intl middleware first to ensure proper locale handling
    const intlResponse = await intlMiddleware(request)

    // Get current locale from the processed request
    const currentLocale = request.nextUrl.pathname.split('/')[1] || defaultLocale

    // Get path without locale
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${currentLocale}`), '')

    console.log('Middleware check:', {
      pathname,
      pathWithoutLocale,
      currentLocale,
      cookies: Object.fromEntries(
        Array.from(request.cookies.getAll()).map((cookie) => [cookie.name, cookie.value])
      ),
    })

    // Handle auth for authenticated routes
    if (
      pathWithoutLocale.includes('/(authenticated)') ||
      pathWithoutLocale.startsWith('/profile')
    ) {
      const isProfileCreate = pathWithoutLocale === '/profile/create'
      const requireProfile = !isProfileCreate

      console.log('Auth check:', {
        pathWithoutLocale,
        isProfileCreate,
        requireProfile,
      })

      const authResponse = await withAuth(request, {
        currentLocale,
        requireProfile,
      })

      // If auth middleware returns a redirect
      if (authResponse.headers.get('Location')) {
        const redirectUrl = new URL(authResponse.headers.get('Location')!, request.url)
        // Ensure the redirect URL has the correct locale prefix
        if (!redirectUrl.pathname.startsWith(`/${currentLocale}`)) {
          redirectUrl.pathname = `/${currentLocale}${redirectUrl.pathname}`
        }

        console.log('Auth redirect:', {
          from: pathname,
          to: redirectUrl.pathname,
        })

        return addSecurityHeaders(NextResponse.redirect(redirectUrl))
      }

      // If no redirect, continue with the intl response
      return addSecurityHeaders(intlResponse)
    }

    // For non-authenticated routes, just return the intl response
    return addSecurityHeaders(intlResponse)
  } catch (error) {
    console.error('Middleware error:', error)
    return addSecurityHeaders(NextResponse.redirect(new URL(`/${defaultLocale}`, request.url)))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
