'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { useProfile } from '@/app/providers/ProfileProvider'
import { useNFTTiers } from '@/lib/web3/hooks/useNFTTiers'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { PanelProvider } from '@/app/providers/PanelProvider'
import { PanelContainer } from '@/components/panels/PanelContainer'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ClientLayout } from '@/components/layouts/ClientLayout'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter()
  const { ready, authenticated, user } = usePrivy()
  const { profile, isLoading: profileLoading } = useProfile()
  const { isLoading: tiersLoading, hasGroup, hasPro } = useNFTTiers()

  const isInitializing = !ready || (!authenticated && !profileLoading)
  const isLoadingState = profileLoading || tiersLoading

  useEffect(() => {
    if (!isInitializing && !authenticated) {
      router.push('/')
      return
    }

    // Only proceed with routing after we have all the necessary data
    if (!isLoadingState && authenticated && user?.wallet?.address) {
      if (!profile) {
        // User has no profile - route to profile creation
        if (hasGroup) {
          router.push('/profile/create?tier=group')
        } else if (hasPro) {
          router.push('/profile/create?tier=pro')
        } else {
          router.push('/profile/create?tier=free')
        }
      }
    }
  }, [
    authenticated,
    isInitializing,
    isLoadingState,
    profile,
    hasGroup,
    hasPro,
    router,
    user?.wallet?.address,
  ])

  // Show loading screen during initialization or loading states
  if (isInitializing || isLoadingState) {
    return <LoadingScreen />
  }

  // Show loading screen if we're authenticated but don't have wallet address yet
  if (authenticated && !user?.wallet?.address) {
    return <LoadingScreen message='Connecting wallet...' />
  }

  // Only render children when we have all necessary data
  return (
    <PanelProvider>
      <div className='flex flex-col min-h-screen'>
        <div className='flex-1'>
          <ClientLayout>
            {children}
            {/* Fixed Panel Container */}
            <div className='fixed right-0 top-[56px] bottom-0 w-full sm:w-[320px] z-[50]'>
              <PanelContainer />
            </div>
          </ClientLayout>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </PanelProvider>
  )
}
