import './globals.css'
import { inter } from '@/fonts'
import { Providers } from './providers'

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params?: { locale?: string }
}) {
  return (
    <html lang={params?.locale || 'en'} className={inter.className} suppressHydrationWarning>
      <body>
        <Providers>
          <div className='min-h-screen flex flex-col'>{children}</div>
        </Providers>
      </body>
    </html>
  )
}
