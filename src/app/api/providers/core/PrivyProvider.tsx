'use client'

import React from 'react'
import { PrivyProvider as Privy } from '@privy-io/react-auth'
import { baseSepolia } from 'wagmi/chains'

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <Privy
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#1f6feb',
        },
        defaultChain: baseSepolia,
        SupportedChains: [baseSepolia],
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
      }}
    >
      {children}
    </Privy>
  )
}
