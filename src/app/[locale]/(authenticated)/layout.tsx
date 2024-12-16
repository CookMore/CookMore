'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { useProfile } from '@/app/api/providers/ProfileProvider'
import { useNFTTiers } from '@/app/api/web3/tier'
import { LoadingScreen } from '@/app/api/loading/LoadingScreen'
import { PanelProvider } from '@/app/api/providers/PanelProvider'
import { PanelContainer } from '@/app/api/panels/PanelContainer'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ClientLayout } from '@/app/api/layouts/ClientLayout'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter()
  const { ready, authenticated, user } = usePrivy()
  const { profile, isLoading: profileLoading } = useProfile()
  const { isLoading: tiersLoading } = useNFTTiers()

  // Handle authentication redirects
  useEffect(() => {
    if (!ready) return // Wait for Privy to initialize

    if (!authenticated) {
      router.push('/')
      return
    }

    if (authenticated && !profileLoading && !profile) {
      router.push('/profile/create')
    }
  }, [ready, authenticated, profileLoading, profile, router])

  // Show loading screen while initializing
  if (!ready || !authenticated) {
    return <LoadingScreen message='Connecting to your wallet...' />
  }

  // Show loading while checking profile
  if (profileLoading) {
    return <LoadingScreen message='Loading your profile...' />
  }

  // Show loading while checking NFT tiers
  if (tiersLoading) {
    return <LoadingScreen message='Checking membership status...' />
  }

  // Main layout once everything is ready
  return (
    <PanelProvider>
      <ClientLayout>
        <div className='flex min-h-full'>
          <div className='flex-1'>{children}</div>
          <PanelContainer />
        </div>
      </ClientLayout>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </PanelProvider>
  )
}
