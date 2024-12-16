import { defaultLocale, locales, getMessages } from '@/i18n'
import { Providers } from '@/app/api/providers/providers'
import { notFound } from 'next/navigation'
import { ClientLayout } from '@/app/api/layouts/ClientLayout'
import { dehydrate, QueryClient } from '@tanstack/react-query'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: { locale?: string }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // Validate locale parameter
  const locale = (await Promise.resolve(params?.locale)) || defaultLocale
  const validLocale = locales.includes(locale) ? locale : defaultLocale

  // In development, be more lenient with locale validation
  if (process.env.NODE_ENV === 'production') {
    if (!validLocale || !locales.includes(validLocale)) {
      notFound()
    }
  }

  // Get messages for the locale
  const messages = await getMessages(validLocale)

  // Initialize QueryClient
  const queryClient = new QueryClient()
  const dehydratedState = dehydrate(queryClient)

  return (
    <html lang={validLocale}>
      <body>
        <Providers messages={messages} locale={validLocale} dehydratedState={dehydratedState}>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  )
}
