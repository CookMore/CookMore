import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={inter.variable}>
      <body className='bg-github-canvas-default'>
        <div className='flex min-h-screen flex-col'>{children}</div>
      </body>
    </html>
  )
}
