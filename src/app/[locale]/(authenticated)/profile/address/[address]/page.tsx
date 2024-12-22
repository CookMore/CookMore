'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks/useProfile'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { ProfileDisplay } from '../../components/ui/ProfileDisplay'
import { ProfileSkeleton } from '../../components/ui/ProfileSkeleton'
import { PanelContainer } from '@/app/api/panels/PanelContainer'
import { PageHeader } from '@/app/api/header/PageHeader'

export default function PublicProfilePage() {
  const params = useParams()
  const { profile, currentTier } = useProfile(params.address as string)
  const { hasGroup, hasPro } = useNFTTiers()

  return (
    <div>
      <PageHeader title={profile?.name || 'Chef Profile'} />
      <PanelContainer>
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileDisplay
            profile={profile}
            tier={currentTier}
            isPublicView
            hasGroup={hasGroup}
            hasPro={hasPro}
          />
        </Suspense>
      </PanelContainer>
    </div>
  )
}
