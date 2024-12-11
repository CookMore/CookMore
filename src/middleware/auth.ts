import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCookie } from '@/lib/utils/cookies'

interface AuthOptions {
  requireProfile?: boolean
  requireAdmin?: boolean
}

export async function withAuth(request: NextRequest, options: AuthOptions = {}) {
  try {
    // Get auth token from cookie
    const token = getCookie(request, 'AUTH_TOKEN')

    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // If profile required, check profile exists
    if (options.requireProfile) {
      const hasProfile = getCookie(request, 'HAS_PROFILE')
      if (!hasProfile) {
        return NextResponse.redirect(new URL('/profile/create', request.url))
      }
    }

    // If admin required, check admin role
    if (options.requireAdmin) {
      const isAdmin = getCookie(request, 'IS_ADMIN')
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    if (process.env.NODE_ENV === 'development' && error instanceof Error) {
      process.stdout.write(`Auth middleware error: ${error.message}\n`)
    }
    return NextResponse.redirect(new URL('/', request.url))
  }
}
