'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BasePageLayout } from '@/app/api/layouts/BasePageLayout'
import { FullPageLayout } from '@/app/api//layouts/FullPage'
import { useAdminCheck } from '@/app/api/auth/hooks/useAdminCheck'
import { useProfile } from '@/app/api/providers/ProfileProvider'
import { LoadingSkeleton } from '@/app/api/loading/LoadingSkeleton'

export default function TierLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAdmin, isLoading: adminLoading } = useAdminCheck()
  const { profile, isLoading: profileLoading } = useProfile()

  useEffect(() => {
    if (adminLoading || profileLoading) return

    // Only redirect if we're sure the user is not an admin
    if (!isAdmin && !adminLoading) {
      router.replace('/profile/create')
    }
  }, [isAdmin, adminLoading, profileLoading, router])

  // Show loading state while checking admin status
  if (adminLoading || profileLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <LoadingSkeleton className='w-full max-w-md space-y-6'>
          <div className='h-8 bg-github-canvas-subtle rounded w-3/4 mx-auto' />
          <div className='space-y-4'>
            <div className='h-12 bg-github-canvas-subtle rounded' />
            <div className='h-12 bg-github-canvas-subtle rounded' />
          </div>
        </LoadingSkeleton>
      </div>
    )
  }

  // Don't render anything if not admin
  if (!isAdmin) {
    return null
  }

  return (
    <BasePageLayout>
      <FullPageLayout>{children}</FullPageLayout>
    </BasePageLayout>
  )
}
