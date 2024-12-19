import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

interface AuthOptions {
  requireProfile?: boolean
  requireAdmin?: boolean
  currentLocale?: string
}

export async function withAuth(request: NextRequest, options: AuthOptions = {}) {
  try {
    const cookieStore = await cookies()
    const token = await cookieStore.get('AUTH_TOKEN')?.value
    const hasProfile = (await cookieStore.get('HAS_PROFILE'))?.value === 'true'
    const path = request.nextUrl.pathname
    const { currentLocale = 'en', requireProfile = true } = options

    // Strip locale from path if present
    const pathWithoutLocale = path.replace(/^\/[a-z]{2}(?=\/|$)/, '')

    // If no token, redirect to login unless already there
    if (!token && pathWithoutLocale !== '/') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Special handling for profile creation
    if (pathWithoutLocale.startsWith('/profile/create')) {
      if (!token) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      // Allow access to profile creation even without a profile
      return NextResponse.next()
    }

    // For authenticated routes that require a profile
    if (token && !hasProfile && requireProfile) {
      if (!pathWithoutLocale.startsWith('/profile/create')) {
        return NextResponse.redirect(new URL('/profile/create', request.url))
      }
    }

    // Admin check if needed
    if (options.requireAdmin && cookieStore.get('IS_ADMIN')?.value !== 'true') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const response = NextResponse.next()
    response.headers.set('x-auth-status', token ? 'authenticated' : 'unauthenticated')
    if (hasProfile) {
      response.headers.set('x-profile-status', 'complete')
    }

    return response
  } catch (error) {
    console.error('Auth middleware error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
