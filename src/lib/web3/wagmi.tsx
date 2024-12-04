'use client'

import * as React from 'react'
import { createConfig, WagmiProvider } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { createPublicClient, http } from 'viem'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5000,
    },
  },
})

// Create wagmi config
const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})

interface WagmiConfigProviderProps {
  children: React.ReactNode
}

// Combined provider that includes both Wagmi and React Query
export function WagmiConfigProvider({ children }: WagmiConfigProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>{children}</WagmiProvider>
    </QueryClientProvider>
  )
}

export { config, queryClient }
