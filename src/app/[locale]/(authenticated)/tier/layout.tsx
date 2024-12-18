'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BasePageLayout } from '@/app/api/layouts/BasePageLayout'
import { FullPageLayout } from '@/app/api/layouts/FullPage'
import { useAdminCheck } from '@/app/api/auth/hooks/useAdminCheck'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks/useProfile'
import { LoadingSkeleton } from '@/app/api/loading/LoadingSkeleton'
import { ProfileProvider } from '@/app/[locale]/(authenticated)/profile/providers/ProfileProvider'

function TierLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAdmin, isLoading: adminLoading } = useAdminCheck()
  const { profile, isLoading: profileLoading } = useProfile()

  useEffect(() => {
    if (adminLoading || profileLoading) return
    if (!isAdmin && !adminLoading) {
      router.replace('/profile/create')
    }
  }, [isAdmin, adminLoading, profileLoading, router])

  if (adminLoading || profileLoading) {
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

  if (!isAdmin) {
    return null
  }

  return (
    <BasePageLayout>
      <FullPageLayout fullWidth>{children}</FullPageLayout>
    </BasePageLayout>
  )
}

export default function TierLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <TierLayoutContent>{children}</TierLayoutContent>
    </ProfileProvider>
  )
}
