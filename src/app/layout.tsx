import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale?: string }
}) {
  // Default to 'en' if no locale is provided
  const locale = params?.locale || 'en'

  try {
    const messages = (await import(`@/messages/${locale}/common.json`)).default

    return (
      <html lang={locale}>
        <body className={inter.className}>
          <Providers locale={locale} messages={messages}>
            {children}
          </Providers>
        </body>
      </html>
    )
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error)
    // Fallback to English messages
    const messages = (await import('@/messages/en/common.json')).default

    return (
      <html lang='en'>
        <body className={inter.className}>
          <Providers locale='en' messages={messages}>
            {children}
          </Providers>
        </body>
      </html>
    )
  }
}
