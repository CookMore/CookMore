'use client'

import { WagmiProvider as WagmiProviderOriginal } from 'wagmi'
import { config } from '@/lib/web3/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProviderOriginal config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProviderOriginal>
  )
}
