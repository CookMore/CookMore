import { defaultLocale, locales, getMessages } from '@/i18n'
import { Providers } from '@/app/api/providers/providers'
import { notFound } from 'next/navigation'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { Toaster } from 'sonner'
import { ErrorBoundaryWrapper } from '@/app/api/error/ErrorBoundaryWrapper'
import { Header } from '@/app/api/header/Header'
import { Header as MarketingHeader } from '@/app/api/header/marketing/Header'
import { FooterWrapper } from '@/app/api/footer/FooterWrapper'
import { LanguageUI } from '@/app/api/language/LanguageUI'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: { locale?: string }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // Validate locale parameter
  const locale = params?.locale || defaultLocale
  const validLocale = locales.includes(locale) ? locale : defaultLocale

  // In development, be more lenient with locale validation
  if (process.env.NODE_ENV === 'production') {
    if (!validLocale || !locales.includes(validLocale)) {
      notFound()
    }
  }

  // Get messages for the locale
  const messages = await getMessages(validLocale)

  return (
    <html lang={validLocale}>
      <body>
        <Providers messages={messages} locale={validLocale}>
          <TooltipProvider>
            <div className='flex min-h-screen flex-col'>
              <ErrorBoundaryWrapper name='root'>
                <Header />
                <MarketingHeader />
                <main className='flex-1 overflow-y-auto'>
                  <LanguageUI />
                  {children}
                </main>
                <FooterWrapper />
              </ErrorBoundaryWrapper>
              <Toaster />
            </div>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  )
}
