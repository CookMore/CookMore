'use client'

import React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from './providers/ThemeProvider'
import { PrivyProvider } from './providers/PrivyProvider'
import { WagmiProvider } from './providers/WagmiProvider'
import { ProfileProvider } from './providers/ProfileProvider'
import { PanelProvider } from './providers/PanelProvider'
import { MotionProvider } from './providers/MotionProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

interface ProvidersProps {
  children: React.ReactNode
  locale: string
  messages: Record<string, unknown>
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 60, // 1 hour
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <MotionProvider>
            <WagmiProvider>
              <PrivyProvider>
                <ProfileProvider>
                  <PanelProvider>
                    {children}
                    {process.env.NODE_ENV === 'development' && (
                      <ReactQueryDevtools initialIsOpen={false} />
                    )}
                  </PanelProvider>
                </ProfileProvider>
              </PrivyProvider>
            </WagmiProvider>
          </MotionProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  )
}
