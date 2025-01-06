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
      currentLocale: options.currentLocale,
      requireProfile: options.requireProfile,
      privyTokenExists: !!privyToken,
      walletAddress,
    })

    // Redirect to home if not authenticated
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(`/${options.currentLocale}`, request.url))
    }

    // Verify profile on chain if required
    if (options.requireProfile && walletAddress) {
      try {
        const contractExists = await verifyProfileOnChain(walletAddress)

        if (contractExists) {
          cookieStore.set(COOKIE_NAMES.HAS_PROFILE, 'true')
          return NextResponse.redirect(new URL(`/${options.currentLocale}/dashboard`, request.url))
        } else {
          cookieStore.delete(COOKIE_NAMES.HAS_PROFILE)
          const pathWithoutLocale = path.replace(new RegExp(`^/${options.currentLocale}`), '')
          if (pathWithoutLocale !== '/profile/create') {
            return NextResponse.redirect(
              new URL(`/${options.currentLocale}/profile/create`, request.url)
            )
          }
        }
      } catch (error) {
        console.error('Error verifying profile:', error)
        cookieStore.delete(COOKIE_NAMES.HAS_PROFILE)
        return NextResponse.redirect(
          new URL(`/${options.currentLocale}/profile/create`, request.url)
        )
      }
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
    return NextResponse.redirect(new URL(`/${options.currentLocale}/dashboard`, request.url))
  }
}
