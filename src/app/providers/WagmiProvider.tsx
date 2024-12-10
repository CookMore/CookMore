'use client'

import { WagmiProvider as Provider } from 'wagmi'
import { config } from '@/lib/web3/wagmi'

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return <Provider config={config}>{children}</Provider>
}
