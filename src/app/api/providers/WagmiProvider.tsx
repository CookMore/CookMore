'use client'

import { WagmiProvider as Wagmi } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { base, baseSepolia } from 'viem/chains'
import { http, createConfig } from 'viem'
import { createConfig as createWagmiConfig } from 'wagmi'

const queryClient = new QueryClient()

const config = createWagmiConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'),
    [baseSepolia.id]: http(
      process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'
    ),
  },
  multichain: true,
  batch: {
    multicall: true,
  },
})

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <Wagmi config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Wagmi>
  )
}
