import { type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export const COOKIE_NAMES = {
  AUTH_TOKEN: 'auth_token',
  HAS_PROFILE: 'has_profile',
  IS_ADMIN: 'is_admin',
  PREFERRED_LOCALE: 'preferred_locale',
  THEME: 'theme',
} as const

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

export function getCookie(request: NextRequest, name: keyof typeof COOKIE_NAMES) {
  return request.cookies.get(COOKIE_NAMES[name])?.value
}

export function setCookie(name: keyof typeof COOKIE_NAMES, value: string, options?: CookieOptions) {
  const cookieStore = cookies()
  cookieStore.set(COOKIE_NAMES[name], value, {
    ...DEFAULT_OPTIONS,
    ...options,
  })
}

export function deleteCookie(name: keyof typeof COOKIE_NAMES) {
  const cookieStore = cookies()
  cookieStore.delete(COOKIE_NAMES[name])
}
