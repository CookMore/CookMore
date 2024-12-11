import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

const locales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh']

export const languages = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  ar: 'العربية',
  hi: 'हिन्दी',
} as const

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound()

  return {
    messages: (await import(`../messages/${locale}/common.json`)).default,
    timeZone: 'UTC',
    now: new Date(),
  }
})

export const defaultLocale = 'en'
export const localePrefix = 'as-needed'

export function getLocaleDisplayName(locale: string) {
  return new Intl.DisplayNames([locale], { type: 'language' }).of(locale) || locale
}

// Wallet-specific translations
export const walletMessages = {
  connect: 'wallet.connect',
  disconnect: 'wallet.disconnect',
  connecting: 'wallet.connecting',
  connected: 'wallet.connected',
  notConnected: 'wallet.notConnected',
  copy: 'wallet.copy',
  copied: 'wallet.copied',
  network: {
    title: 'wallet.network.title',
    base: 'wallet.network.base',
    baseSepolia: 'wallet.network.baseSepolia',
    unsupported: 'wallet.network.unsupported'
  },
  types: {
    embedded: 'wallet.types.embedded',
    coinbase: 'wallet.types.coinbase',
    other: 'wallet.types.other'
  },
  errors: {
    connect: 'wallet.errors.connect',
    disconnect: 'wallet.errors.disconnect',
    network: 'wallet.errors.network'
  }
} as const
