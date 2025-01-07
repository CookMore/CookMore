import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAMES } from '@/app/api/auth/constants'

interface AuthOptions {
  currentLocale: string
}

export async function withAuth(request: NextRequest, options: AuthOptions) {
  try {
    const privyToken = request.cookies.get(COOKIE_NAMES.PRIVY_TOKEN)
    const walletAddress = request.cookies.get(COOKIE_NAMES.WALLET_ADDRESS)?.value
    const isAuthenticated = !!privyToken?.value && !!walletAddress
    const path = request.nextUrl.pathname

    console.log('Auth middleware state:', {
      path,
      isAuthenticated,
      currentLocale: options.currentLocale,
      privyTokenExists: !!privyToken,
      walletAddress,
    })

    // Check if the path is part of the authenticated section
    const isAuthenticatedPath = path.startsWith(`/${options.currentLocale}/(authenticated)`)

    // Redirect to home if not authenticated and on an authenticated path
    if (!isAuthenticated && isAuthenticatedPath) {
      return NextResponse.redirect(new URL(`/${options.currentLocale}`, request.url))
    }

    // Default response for authenticated users
    const response = NextResponse.next()

    // Set cookies in the response
    if (privyToken) {
      response.cookies.set(COOKIE_NAMES.PRIVY_TOKEN, privyToken.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
    }

    if (walletAddress) {
      response.cookies.set(COOKIE_NAMES.WALLET_ADDRESS, walletAddress, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60,
      })
    }

    return response
  } catch (error) {
    console.error('Auth middleware error:', error)
    return NextResponse.redirect(new URL(`/${options.currentLocale}`, request.url))
  }
}
