import { ReactNode } from 'react'
import { Providers } from '@/app/api/providers/providers'
import { defaultLocale, locales } from '@/i18n'
import { unstable_setRequestLocale } from 'next-intl/server'
import { getMessages } from '@/i18n'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/app/api/providers/core/ThemeProvider'
import { PrivyProvider } from '@/app/api/providers/core/PrivyProvider'
import { WagmiProvider } from '@/app/api/providers/core/WagmiProvider'
import { MotionProvider } from '@/app/api/providers/core/MotionProvider'

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
    <html lang={validLocale}>
      <body className='bg-github-canvas-default'>
        <Providers messages={messages} locale={validLocale}>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
