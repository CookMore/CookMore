'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { useProfile } from '@/app/api/providers/ProfileProvider'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { LoadingSkeleton } from '@/app/api/loading/LoadingSkeleton'
import { PanelProvider } from '@/app/api/providers/PanelProvider'
import { PanelContainer } from '@/app/api/panels/PanelContainer'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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

  // Show loading skeleton while initializing
  if (!ready || !authenticated) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <div className='w-full max-w-md'>
          <LoadingSkeleton className='space-y-6'>
            <div className='h-8 bg-github-canvas-subtle rounded w-3/4 mx-auto' />
            <div className='space-y-4'>
              <div className='h-12 bg-github-canvas-subtle rounded' />
              <div className='h-12 bg-github-canvas-subtle rounded' />
            </div>
          </LoadingSkeleton>
        </div>
      </div>
    )
  }

  // Show loading skeleton while checking profile
  if (profileLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <div className='w-full max-w-md'>
          <LoadingSkeleton className='space-y-6'>
            <div className='h-8 bg-github-canvas-subtle rounded w-1/2 mx-auto' />
            <div className='space-y-4'>
              <div className='h-16 bg-github-canvas-subtle rounded' />
              <div className='grid grid-cols-2 gap-4'>
                <div className='h-12 bg-github-canvas-subtle rounded' />
                <div className='h-12 bg-github-canvas-subtle rounded' />
              </div>
            </div>
          </LoadingSkeleton>
        </div>
      </div>
    )
  }

  // Show loading skeleton while checking NFT tiers
  if (tiersLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <div className='w-full max-w-md'>
          <LoadingSkeleton className='space-y-6'>
            <div className='h-8 bg-github-canvas-subtle rounded w-2/3 mx-auto' />
            <div className='space-y-4'>
              <div className='h-20 bg-github-canvas-subtle rounded' />
              <div className='grid grid-cols-3 gap-4'>
                <div className='h-10 bg-github-canvas-subtle rounded' />
                <div className='h-10 bg-github-canvas-subtle rounded' />
                <div className='h-10 bg-github-canvas-subtle rounded' />
              </div>
            </div>
          </LoadingSkeleton>
        </div>
      </div>
    )
  }

  // Main layout once everything is ready
  return (
    <PanelProvider>
      <div className='min-h-screen'>
        {children}
        <PanelContainer />
      </div>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </PanelProvider>
  )
}
