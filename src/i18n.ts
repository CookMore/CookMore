import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, defaultLocale, i18nConfig } from '@/config/i18n'
import type { Locale } from '@/config/i18n'

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale is supported
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  try {
    return {
      messages: (await import(`@/messages/${locale}/common.json`)).default,
      timeZone: 'UTC',
      now: new Date(),
    }
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error)
    // Fallback to default locale
    return {
      messages: (await import(`@/messages/${defaultLocale}/common.json`)).default,
      timeZone: 'UTC',
      now: new Date(),
    }
  }
})

// Re-export for convenience
export { locales, defaultLocale, i18nConfig }
