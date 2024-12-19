import { ReactNode } from 'react'
import { Providers } from '@/app/api/providers/providers'
import { defaultLocale, locales } from '@/i18n'
import { unstable_setRequestLocale } from 'next-intl/server'
import { getMessages } from '@/i18n'
import { Toaster } from 'sonner'

interface LocaleLayoutProps {
  children: ReactNode
  params: { locale?: string }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = (await params)?.locale || defaultLocale
  const validLocale = locales.includes(locale) ? locale : defaultLocale
  const messages = await getMessages(validLocale)

  unstable_setRequestLocale(validLocale)

  return (
    <div lang={validLocale} className='contents'>
      <Providers messages={messages} locale={validLocale}>
        {children}
        <Toaster />
      </Providers>
    </div>
  )
}
