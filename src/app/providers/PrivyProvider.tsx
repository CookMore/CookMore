'use client'

import { PrivyProvider as Privy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/routes'
import { baseSepolia } from 'viem/chains'
import type { User } from '@privy-io/react-auth'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleStateChange = useCallback(
    async (user: User | null) => {
      console.log('👤 User state changed:', user ? 'authenticated' : 'unauthenticated')

      // Clear query cache when user logs out
      if (!user) {
        queryClient.clear()
        // Only redirect if we're not already on a marketing route
        const currentPath = window.location.pathname
        if (
          !currentPath.startsWith('/features') &&
          !currentPath.startsWith('/discover') &&
          !currentPath.startsWith('/pricing') &&
          !currentPath.startsWith('/club')
        ) {
          router.push(ROUTES.MARKETING.HOME)
        }
      }
    },
    [queryClient, router]
  )

  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is not defined')
  }

  if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
    throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not defined')
  }

  return (
    <Privy
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      onStateChange={handleStateChange}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#238636',
        },
        supportedChains: [baseSepolia],
        defaultChain: baseSepolia,
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
      }}
    >
      {children}
    </Privy>
  )
}
