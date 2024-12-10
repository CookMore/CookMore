'use client'

import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { PrivyProvider } from '@/app/providers/PrivyProvider'
import { ProfileProvider } from '@/app/providers/ProfileProvider'
import { PanelProvider } from '@/app/providers/PanelProvider'
import { MotionProvider } from '@/app/providers/MotionProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, useEffect } from 'react'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log('🟢 Client mounted')
  }, [])

  if (!mounted) {
    console.log('🟡 Client not mounted yet')
    return null
  }

  return children
}

const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
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

  console.log('🟢 Initializing providers')

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <ThemeProvider>
          <MotionProvider>
            <ClientOnly>
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
            </ClientOnly>
          </MotionProvider>
        </ThemeProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
