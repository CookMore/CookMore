import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

interface AuthOptions {
  requireProfile?: boolean
  requireAdmin?: boolean
  currentLocale: string
}

export async function withAuth(request: NextRequest, options: AuthOptions) {
  try {
    const cookieStore = await cookies()
    const isAuthenticated = request.cookies.has('privy-token')
    const hasProfile = (await cookieStore.get('HAS_PROFILE'))?.value === 'true'
    const path = request.nextUrl.pathname
    const { currentLocale, requireProfile = true } = options

    console.log('Auth middleware state:', {
      path,
      isAuthenticated,
      hasProfile,
      currentLocale,
      requireProfile,
      cookies: Object.fromEntries(
        Array.from(request.cookies.getAll()).map((cookie) => [cookie.name, cookie.value])
      ),
      headers: Object.fromEntries(request.headers.entries()),
    })

    // If not authenticated, redirect to home
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to home')
      return NextResponse.redirect(new URL('/', request.url))
    }

    // For authenticated users without profiles
    if (!hasProfile && requireProfile) {
      const pathWithoutLocale = path.replace(new RegExp(`^/${currentLocale}`), '')
      if (pathWithoutLocale !== '/profile/create') {
        console.log('User authenticated but no profile, redirecting to profile creation')
        return NextResponse.redirect(new URL('/profile/create', request.url))
      }
    }

    // For authenticated users with profiles trying to access profile creation
    if (hasProfile && path.endsWith('/profile/create')) {
      console.log('User already has profile, redirecting to profile page')
      return NextResponse.redirect(new URL('/profile', request.url))
    }

    // Admin check if needed
    if (options.requireAdmin && cookieStore.get('IS_ADMIN')?.value !== 'true') {
      console.log('Admin access denied, redirecting to home')
      return NextResponse.redirect(new URL('/', request.url))
    }

    const response = NextResponse.next()
    response.headers.set('x-auth-status', 'authenticated')
    if (hasProfile) {
      response.headers.set('x-profile-status', 'complete')
    }

    console.log('Auth middleware response:', {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    })

    return response
  } catch (error) {
    console.error('Auth middleware error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
