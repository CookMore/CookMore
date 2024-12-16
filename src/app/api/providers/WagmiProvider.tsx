'use client'

import { WagmiProvider as Wagmi } from 'wagmi'
import { base, baseSepolia } from 'viem/chains'
import { http } from 'viem'
import { createConfig } from 'wagmi'

const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'),
    [baseSepolia.id]: http(
      process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'
    ),
  },
})

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return <Wagmi config={config}>{children}</Wagmi>
}
