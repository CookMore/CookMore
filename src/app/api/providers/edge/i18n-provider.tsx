'use client'

import { NextIntlClientProvider } from 'next-intl'

export function I18nProvider({
  children,
  messages,
  locale = 'en',
}: {
  children: React.ReactNode
  messages: any
  locale?: string
}) {
  return (
    <NextIntlClientProvider
      messages={messages}
      locale={locale}
      timeZone='UTC'
      defaultTranslationValues={{}}
      now={new Date()}
    >
      {children}
    </NextIntlClientProvider>
  )
}
