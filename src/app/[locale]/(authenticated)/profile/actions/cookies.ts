'use server'

import { cookies } from 'next/headers'
import { COOKIE_NAMES, type CookieOptions, DEFAULT_OPTIONS } from '@/app/api/utils/cookies'

export async function setCookie(
  name: keyof typeof COOKIE_NAMES,
  value: string,
  options?: CookieOptions
) {
  const cookieStore = cookies()
  cookieStore.set(COOKIE_NAMES[name], value, {
    ...DEFAULT_OPTIONS,
    ...options,
  })
}

export async function deleteCookie(name: keyof typeof COOKIE_NAMES) {
  const cookieStore = cookies()
  cookieStore.delete(COOKIE_NAMES[name])
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

export async function setHasProfileCookie(hasProfile: boolean) {
  await setCookie('HAS_PROFILE', hasProfile.toString(), {
    ...DEFAULT_OPTIONS,
    httpOnly: true,
  })
}

export async function getWalletAddressCookie() {
  const cookieStore = cookies()
  return cookieStore.get(COOKIE_NAMES.WALLET_ADDRESS)?.value
}

export async function getHasProfileCookie() {
  const cookieStore = cookies()
  return cookieStore.get(COOKIE_NAMES.HAS_PROFILE)?.value === 'true'
}
