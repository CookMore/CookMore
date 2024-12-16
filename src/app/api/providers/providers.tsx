'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider } from './WagmiProvider'
import { MotionProvider } from './MotionProvider'
import { ThemeProvider } from './ThemeProvider'
import { QueryProvider } from '@/app/api/providers/edge/query-provider'
import { I18nProvider } from './edge/i18n-provider'
import { CombinedEdgeProvider } from './edge'
import { baseChain, baseSepoliaChain } from '@/app/api/web3/config/chains'
import { ProfileProvider } from './ProfileProvider'

export function Providers({
  children,
  messages,
  locale = 'en',
  address,
  recipeId,
  userId,
}: {
  children: React.ReactNode
  messages: any
  locale?: string
  address?: string
  recipeId?: string
  userId?: string
}) {
  return (
    <I18nProvider messages={messages} locale={locale}>
      <QueryProvider>
        <WagmiProvider>
          <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
            config={{
              loginMethods: ['email', 'wallet'],
              SupportedChains: [baseChain, baseSepoliaChain],
              walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
              appearance: {
                theme: 'dark',
                accentColor: '#7C3AED',
              },
            }}
          >
            <CombinedEdgeProvider address={address} recipeId={recipeId} userId={userId}>
              <ProfileProvider>
                <MotionProvider>
                  <ThemeProvider>{children}</ThemeProvider>
                </MotionProvider>
              </ProfileProvider>
            </CombinedEdgeProvider>
          </PrivyProvider>
        </WagmiProvider>
      </QueryProvider>
    </I18nProvider>
  )
}
