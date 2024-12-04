'use client'

import { WagmiConfig } from 'wagmi'
import { config } from '@/lib/wagmi'
import { PrivyProvider } from '@privy-io/react-auth'
import { useEffect } from 'react'

export function PrivyClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const init = async () => {
      const { hydrate } = await import('@/lib/wagmi')
      hydrate()
    }
    init()
  }, [])

  return (
    <WagmiConfig config={config}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
          loginMethods: ['email', 'wallet'],
          appearance: {
            theme: 'dark',
            accentColor: '#22c55e',
          },
        }}
      >
        {children}
      </PrivyProvider>
    </WagmiConfig>
  )
}
