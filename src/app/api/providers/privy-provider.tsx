'use client'

import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth'
import type { PrivyClientConfig } from '@privy-io/react-auth'
import { ReactNode } from 'react'
import { base, baseSepolia } from 'viem/chains'

interface Props {
  children: ReactNode
  appId: string
}

const PrivyProvider = ({ children, appId }: Props) => {
  const chain = process.env.NEXT_PUBLIC_NETWORK === 'production' ? base : baseSepolia

  const config: PrivyClientConfig = {
    loginMethods: ['email', 'wallet'],
    appearance: {
      theme: 'light',
      accentColor: '#676FFF',
    },
    SupportedChains: [chain],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
  }

  return (
    <BasePrivyProvider appId={appId} config={config}>
      {children}
    </BasePrivyProvider>
  )
}

export default PrivyProvider
