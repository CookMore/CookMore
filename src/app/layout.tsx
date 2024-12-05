'use client'

import './globals.css'
import { inter } from '@/fonts'
import { Toaster } from 'sonner'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { PanelProvider } from '@/app/providers/PanelProvider'
import { MotionProvider } from '@/app/providers/MotionProvider'
import { RecipeProvider } from '@/app/providers/RecipeProvider'
import { PrivyProvider } from '@/app/providers/PrivyProvider'
import { WagmiProvider } from '@/app/providers/WagmiProvider'
import { ProfileProvider } from '@/app/providers/ProfileProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning data-theme='dark' className={`${inter.variable}`}>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider>
          <WagmiProvider>
            <PrivyProvider>
              <ProfileProvider>
                <MotionProvider>
                  <TooltipProvider>
                    <PanelProvider>
                      <RecipeProvider>
                        <div className='flex flex-col min-h-screen'>
                          <Header />
                          <main className='flex-1'>{children}</main>
                          <Footer />
                        </div>
                      </RecipeProvider>
                    </PanelProvider>
                  </TooltipProvider>
                </MotionProvider>
              </ProfileProvider>
            </PrivyProvider>
          </WagmiProvider>
        </ThemeProvider>
        <Toaster richColors position='top-center' closeButton expand={false} duration={4000} />
      </body>
    </html>
  )
}
