'use client'

import { ThemeProvider } from './core/ThemeProvider'
import { PrivyProvider } from './core/PrivyProvider'
import { WagmiProvider } from './core/WagmiProvider'
import { MotionProvider } from './core/MotionProvider'
import { KitchenProvider } from './features/KitchenProvider'
import { ProfileProvider } from '@/app/[locale]/(authenticated)/profile/providers/ProfileProvider'
import { RecipeProvider } from './features/RecipeProvider'
import { QueryClientProvider, QueryClient, HydrationBoundary } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { I18nProvider } from './edge/i18n-provider'
import { JobsProvider } from '@/app/[locale]/(authenticated)/jobs/context/JobsContext'
import { PanelProvider } from './features/PanelProvider'
import { TooltipProvider } from '@radix-ui/react-tooltip'

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
  messages = {},
  locale,
}: {
  children: React.ReactNode
  messages?: any
  locale: string
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <TooltipProvider>
        <ThemeProvider>
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
            <WagmiProvider>
              <MotionProvider>
                <KitchenProvider>
                  <ProfileProvider>
                    <RecipeProvider>
                      <JobsProvider>
                        <PanelProvider>
                          <HydrationBoundary state={messages}>
                            <I18nProvider locale={locale} messages={messages}>
                              {children}
                            </I18nProvider>
                          </HydrationBoundary>
                        </PanelProvider>
                      </JobsProvider>
                    </RecipeProvider>
                  </ProfileProvider>
                </KitchenProvider>
              </MotionProvider>
            </WagmiProvider>
          </PrivyProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
