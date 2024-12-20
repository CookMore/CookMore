'use client'

import React from 'react'
import { PrivyProvider as Privy } from '@privy-io/react-auth'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { baseSepolia } from 'wagmi/chains'

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations('wallet.connect')

  return (
    <Privy
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#1f6feb',
          showWalletLoginFirst: true,
        },
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
      }}
      onSuccess={() => {
        toast.success(t('success'))
      }}
      onError={(error) => {
        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Privy error:', error)
        }
        toast.error(t('error'))
      }}
    >
      {children}
    </Privy>
  )
}
