import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

interface AuthOptions {
  requireProfile?: boolean
  requireAdmin?: boolean
}

export async function withAuth(request: NextRequest, options: AuthOptions = {}) {
  try {
    // Get auth token from cookie
    const cookieStore = cookies()
    const token = cookieStore.get('AUTH_TOKEN')?.value
    const hasProfile = cookieStore.get('HAS_PROFILE')?.value === 'true'
    const path = request.nextUrl.pathname

    // If no token, redirect to login unless already there
    if (!token && path !== '/') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Special handling for profile creation
    if (path.startsWith('/profile/create')) {
      // Allow access to profile creation even without profile
      if (token) return NextResponse.next()
      return NextResponse.redirect(new URL('/', request.url))
    }

    // For authenticated routes that require a profile
    if (token && !hasProfile && options.requireProfile) {
      // Don't redirect if already going to profile creation
      if (!path.startsWith('/profile/create')) {
        return NextResponse.redirect(new URL('/profile/create', request.url))
      }
    }

    // Admin check if needed
    if (options.requireAdmin && cookieStore.get('IS_ADMIN')?.value !== 'true') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const response = NextResponse.next()

    // Add auth-related headers
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
