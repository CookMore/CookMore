'use client'

import { useEffect } from 'react'
import { HydrationLoader } from '@/app/api/loading/HydrationLoader'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { LoadingSkeleton } from '@/app/api/loading/LoadingSkeleton'
import { ProfileEdgeProvider } from '@/app/[locale]/(authenticated)/profile/providers/edge/ProfileEdgeProvider'

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isLoading: authLoading, user } = useAuth()

  useEffect(() => {
    console.log('DashboardLayoutContent state:', {
      authLoading,
      userWallet: user?.wallet?.address,
    })
  }, [authLoading, user?.wallet?.address])

  // Show loading state while checking auth
  if (authLoading) {
    console.log('DashboardLayoutContent: Loading state')
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <div className='w-full space-y-6'>
          <LoadingSkeleton className='h-8 w-3/4 mx-auto' />
          <div className='space-y-4'>
            <LoadingSkeleton className='h-12 w-full' />
            <LoadingSkeleton className='h-12 w-full' />
          </div>
        </div>
      </div>
    )
  }

  console.log('DashboardLayoutContent: Rendering content')
  return <HydrationLoader>{children}</HydrationLoader>
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  useEffect(() => {
    console.log('DashboardLayout: Mounted', { userWallet: user?.wallet?.address })
  }, [user?.wallet?.address])

  if (!user?.wallet?.address) {
    console.log('DashboardLayout: No wallet')
    return (
      <div className='min-h-[calc(100vh-4rem)] w-full max-w-6xl mx-auto px-6 py-8 flex items-center justify-center'>
        <p>Loading wallet...</p>
      </div>
    )
  }

  console.log('DashboardLayout: Rendering with ProfileEdgeProvider')
  return (
    <ProfileEdgeProvider address={user.wallet.address}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </ProfileEdgeProvider>
  )
}
