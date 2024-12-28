'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { ProfileDisplay } from '../../components/ui/ProfileDisplay'
import { ProfileSkeleton } from '../../components/ui/ProfileSkeleton'
import { PanelContainer } from '@/app/api/panels/PanelContainer'
import { PageHeader } from '@/app/api/header/PageHeader'

export default function PublicProfilePage() {
  const params = useParams()
  const { user, hasProfile, currentTier } = useAuth()

  return (
    <div>
      <PageHeader title={user?.wallet?.address || 'Chef Profile'} />
      <PanelContainer>
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileDisplay
            profile={user}
            currentTier={currentTier}
            isPublicView
            hasProfile={hasProfile}
          />
        </Suspense>
      </PanelContainer>
    </div>
  )
}
