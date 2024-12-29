import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAMES } from '@/app/api/auth/constants'
import { verifyProfileOnChain } from '@/app/[locale]/(authenticated)/profile/services/server/profile-verification'

interface AuthOptions {
  requireProfile?: boolean
  requireAdmin?: boolean
  currentLocale: string
}

export async function withAuth(request: NextRequest, options: AuthOptions) {
  try {
    const cookieStore = await cookies()
    const privyToken = request.cookies.get(COOKIE_NAMES.PRIVY_TOKEN)
    const hasProfileCookie = cookieStore.get(COOKIE_NAMES.HAS_PROFILE)
    const isAuthenticated = !!privyToken?.value
    const walletAddress = request.cookies.get(COOKIE_NAMES.WALLET_ADDRESS)?.value
    const path = request.nextUrl.pathname

    console.log('Auth middleware state:', {
      path,
      isAuthenticated,
      hasProfile: !!hasProfileCookie,
      hasProfileCookie: !!hasProfileCookie,
      currentLocale: options.currentLocale,
      requireProfile: options.requireProfile,
      privyTokenExists: !!privyToken,
      walletAddress,
      cookies: Object.fromEntries(
        Array.from(request.cookies.getAll()).map((cookie) => [cookie.name, cookie.value])
      ),
    })

    // If not authenticated, redirect to home
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(`/${options.currentLocale}`, request.url))
    }

    // For authenticated users, verify profile on chain if we have the wallet address
    if (options.requireProfile && walletAddress) {
      try {
        const contractExists = await verifyProfileOnChain(walletAddress)

        // Update cookie to match blockchain state
        if (contractExists) {
          cookieStore.set(COOKIE_NAMES.HAS_PROFILE, 'true')
        } else {
          cookieStore.delete(COOKIE_NAMES.HAS_PROFILE)
        }

        // Redirect to profile creation if needed
        if (!contractExists) {
          const pathWithoutLocale = path.replace(new RegExp(`^/${options.currentLocale}`), '')
          if (pathWithoutLocale !== '/profile/create') {
            return NextResponse.redirect(
              new URL(`/${options.currentLocale}/profile/create`, request.url)
            )
          }
        }
      } catch (error) {
        console.error('Error verifying profile:', error)
        // On verification error, assume no profile exists
        cookieStore.delete(COOKIE_NAMES.HAS_PROFILE)
        return NextResponse.redirect(
          new URL(`/${options.currentLocale}/profile/create`, request.url)
        )
      }
    }

    // If we reach here, either:
    // 1. We don't require a profile
    // 2. User has a profile
    // 3. User is on the profile creation page
    const response = NextResponse.next()

    // Ensure cookies are properly set in the response
    if (privyToken) {
      response.cookies.set(COOKIE_NAMES.PRIVY_TOKEN, privyToken.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
    }

    if (hasProfileCookie) {
      response.cookies.set(COOKIE_NAMES.HAS_PROFILE, hasProfileCookie.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
    }

    if (walletAddress) {
      response.cookies.set(COOKIE_NAMES.WALLET_ADDRESS, walletAddress, {
        httpOnly: false, // Allow client-side access
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60, // 24 hours
      })
    }

    return response
  } catch (error) {
    console.error('Auth middleware error:', error)
    // On error, redirect to home page
    return NextResponse.redirect(new URL(`/${options.currentLocale}`, request.url))
  }
}
