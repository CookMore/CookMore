import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { getMessages } from 'next-intl/server'
import { locales } from '@/config/i18n'
import { LanguageUI } from '@/components/ui/LanguageUI'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

async function getLocaleMessages(locale: string) {
  try {
    console.log('🟡 [LocaleLayout] Loading messages for locale:', locale)
    const messages = await getMessages(locale)
    console.log('🟢 [LocaleLayout] Successfully loaded messages:', {
      locale,
      messageKeys: Object.keys(messages),
    })
    return messages
  } catch (error) {
    console.error('🔴 [LocaleLayout] Failed to load messages:', error)
    // Fallback to English messages
    return getMessages('en')
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getLocaleMessages(locale)
  console.log('🟢 [LocaleLayout] Rendering with locale:', locale)

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LanguageUI />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
