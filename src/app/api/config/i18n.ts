export const locales = [
  'en',
  'es',
  'fr',
  'de',
  'it',
  'pt',
  'ru',
  'zh',
  'ja',
  'ko',
  'ar',
  'hi',
] as const

export const defaultLocale = 'en' as const

export type Locale = (typeof locales)[number]

// Language names for display
export const languageNames: Record<Locale, string> = {
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
}

// Language direction (for RTL support)
export const languageDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  es: 'ltr',
  fr: 'ltr',
  de: 'ltr',
  it: 'ltr',
  pt: 'ltr',
  ru: 'ltr',
  zh: 'ltr',
  ja: 'ltr',
  ko: 'ltr',
  ar: 'rtl',
  hi: 'ltr',
}

// Next-intl configuration
export const i18nConfig = {
  defaultLocale,
  locales,
  localePrefix: 'always',
} as const
