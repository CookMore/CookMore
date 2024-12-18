'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { useProfile, ProfileProvider } from '@/app/[locale]/(authenticated)/profile'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { LoadingSkeleton } from '@/app/api/loading/LoadingSkeleton'
import { PanelProvider } from '@/app/api/providers/features/PanelProvider'
import { PanelContainer } from '@/app/api/panels/PanelContainer'
import { BasePageLayout } from '@/app/api/layouts/BasePageLayout'
import { ClientLayout } from '@/app/api/layouts/ClientLayout'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function AuthLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { ready, authenticated } = usePrivy()
  const { profile, isLoading: profileLoading } = useProfile()
  const { isLoading: tiersLoading } = useNFTTiers()

  useEffect(() => {
    if (!ready) return
    if (!authenticated) {
      router.push('/')
      return
    }
    if (authenticated && !profileLoading && !profile) {
      router.push('/profile/create/select-tier')
    }
  }, [ready, authenticated, profileLoading, profile, router])

  if (!ready || !authenticated || profileLoading || tiersLoading) {
    return (
      <BasePageLayout>
        <div className='flex min-h-screen items-center justify-center p-4'>
          <LoadingSkeleton className='w-full max-w-md space-y-6'>
            <div className='h-8 bg-github-canvas-subtle rounded w-3/4 mx-auto' />
            <div className='space-y-4'>
              <div className='h-12 bg-github-canvas-subtle rounded' />
              <div className='h-12 bg-github-canvas-subtle rounded' />
            </div>
          </LoadingSkeleton>
        </div>
      </BasePageLayout>
    )
  }

  return (
    <PanelProvider>
      <ClientLayout>{children}</ClientLayout>
      <PanelContainer />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </PanelProvider>
  )
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { ready, authenticated } = usePrivy()

  if (!ready || !authenticated) {
    return <BasePageLayout>{children}</BasePageLayout>
  }

  return (
    <ProfileProvider>
      <AuthLayoutInner>{children}</AuthLayoutInner>
    </ProfileProvider>
  )
}
