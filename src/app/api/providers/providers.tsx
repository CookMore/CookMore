'use client'

import { ThemeProvider } from './ThemeProvider'
import { WagmiConfig } from 'wagmi'
import { wagmiConfig } from '../blockchain/config/wagmi'
import { QueryClientProvider, QueryClient, HydrationBoundary } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PrivyProvider } from '@privy-io/react-auth'
import { I18nProvider } from './edge/i18n-provider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
})

export function Providers({
  children,
  messages,
  locale,
}: {
  children: React.ReactNode
  messages: any
  locale: string
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary>
        <I18nProvider messages={messages} locale={locale}>
          <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
            config={{
              loginMethods: ['email', 'wallet'],
              appearance: {
                theme: 'dark',
                accentColor: '#F97316',
              },
            }}
          >
            <WagmiConfig config={wagmiConfig}>
              <ThemeProvider>{children}</ThemeProvider>
            </WagmiConfig>
          </PrivyProvider>
        </I18nProvider>
      </HydrationBoundary>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
