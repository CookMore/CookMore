'use client'

import { COOKIE_NAMES } from '@/app/api/auth/constants'

interface CookieOptions {
  path?: string
  maxAge?: number
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

export function setCookie(
  name: keyof typeof COOKIE_NAMES,
  value: string,
  options: CookieOptions = {}
) {
  const {
    path = '/',
    maxAge = 24 * 60 * 60, // 24 hours
    secure = process.env.NODE_ENV === 'production',
    sameSite = 'lax',
  } = options

  const cookieValue = `${COOKIE_NAMES[name]}=${value}; path=${path}; max-age=${maxAge}${
    secure ? '; secure' : ''
  }; samesite=${sameSite}`

  document.cookie = cookieValue
}

export function clearCookie(name: keyof typeof COOKIE_NAMES, options: CookieOptions = {}) {
  const { path = '/', secure = process.env.NODE_ENV === 'production', sameSite = 'lax' } = options

  document.cookie = `${COOKIE_NAMES[name]}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT${
    secure ? '; secure' : ''
  }; samesite=${sameSite}`
}

export function getCookie(name: keyof typeof COOKIE_NAMES): string | undefined {
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(COOKIE_NAMES[name]))
    ?.split('=')[1]

  return value
}