'use client'

import { WagmiProvider } from 'wagmi'
import type { Config } from 'wagmi'

interface WagmiConfigProps {
  children: React.ReactNode
  config: Config
}

export function WagmiConfig({ children, config }: WagmiConfigProps) {
  return <WagmiProvider config={config}>{children}</WagmiProvider>
}
