'use server'

import { type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

const COOKIE_NAMES_CONFIG = {
  AUTH_TOKEN: 'auth_token',
  HAS_PROFILE: 'has_profile',
  IS_ADMIN: 'is_admin',
  PREFERRED_LOCALE: 'preferred_locale',
  THEME: 'theme',
  WALLET_ADDRESS: 'wallet_address',
} as const

export async function getCookieNames() {
  return COOKIE_NAMES_CONFIG
}

type CookieNames = typeof COOKIE_NAMES_CONFIG

interface CookieOptions {
  maxAge?: number
  path?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

const DEFAULT_OPTIONS: CookieOptions = {
  maxAge: 30 * 24 * 60 * 60, // 30 days
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'lax',
}

const PROFILE_COOKIE_OPTIONS: CookieOptions = {
  ...DEFAULT_OPTIONS,
  httpOnly: true, // Always httpOnly for security
  maxAge: 7 * 24 * 60 * 60, // 7 days for profile state
  secure: true, // Always secure
}

export async function setCookie(name: keyof CookieNames, value: string, options?: CookieOptions) {
  const cookieStore = await cookies()
  const finalOptions =
    name === 'HAS_PROFILE'
      ? { ...PROFILE_COOKIE_OPTIONS, ...options }
      : { ...DEFAULT_OPTIONS, ...options }

  cookieStore.set(COOKIE_NAMES_CONFIG[name], value, finalOptions)
}

export async function deleteCookie(name: keyof CookieNames) {
  const cookieStore = await cookies()
  cookieStore.delete({
    name: COOKIE_NAMES_CONFIG[name],
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function getCookie(request: NextRequest, name: keyof CookieNames) {
  return request.cookies.get(COOKIE_NAMES_CONFIG[name])?.value
}

export async function setWalletAddressCookie(address: string, options?: CookieOptions) {
  await setCookie('WALLET_ADDRESS', address, {
    ...DEFAULT_OPTIONS,
    httpOnly: false, // Allow client-side access
    maxAge: 24 * 60 * 60, // 24 hours
    ...options,
  })
}

export async function clearWalletAddressCookie() {
  await deleteCookie('WALLET_ADDRESS')
}

export async function setHasProfileCookie(hasProfile: boolean | undefined) {
  if (hasProfile === undefined) return
  try {
    await setCookie('HAS_PROFILE', hasProfile.toString(), PROFILE_COOKIE_OPTIONS)
  } catch (error) {
    console.error('Error setting profile cookie:', error)
    // Fallback to client-side cookie if server-side fails
    if (typeof window !== 'undefined') {
      document.cookie = `${COOKIE_NAMES_CONFIG.HAS_PROFILE}=${hasProfile}; path=/; max-age=${
        PROFILE_COOKIE_OPTIONS.maxAge
      }; ${PROFILE_COOKIE_OPTIONS.secure ? 'secure;' : ''} samesite=lax`
    }
  }
}

export async function getHasProfileCookie() {
  try {
    const cookieStore = await cookies()
    const value = cookieStore.get(COOKIE_NAMES_CONFIG.HAS_PROFILE)?.value
    return value === 'true'
  } catch (error) {
    console.error('Error getting profile cookie:', error)
    // Fallback to client-side cookie if server-side fails
    if (typeof window !== 'undefined') {
      const value = document.cookie
        .split('; ')
        .find((row) => row.startsWith(COOKIE_NAMES_CONFIG.HAS_PROFILE))
        ?.split('=')[1]
      return value === 'true'
    }
    return false
  }
}

export async function clearHasProfileCookie() {
  try {
    await deleteCookie('HAS_PROFILE')
  } catch (error) {
    console.error('Error clearing profile cookie:', error)
    // Fallback to client-side cookie if server-side fails
    if (typeof window !== 'undefined') {
      document.cookie = `${
        COOKIE_NAMES_CONFIG.HAS_PROFILE
      }=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
  }
}

export async function getWalletAddressCookie() {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAMES_CONFIG.WALLET_ADDRESS)?.value
}

export async function areCookiesEnabled() {
  try {
    const cookieStore = await cookies()
    const testValue = 'test'
    await setCookie('WALLET_ADDRESS', testValue)
    const result = cookieStore.get(COOKIE_NAMES_CONFIG.WALLET_ADDRESS)?.value === testValue
    await deleteCookie('WALLET_ADDRESS')
    return result
  } catch {
    return false
  }
}
