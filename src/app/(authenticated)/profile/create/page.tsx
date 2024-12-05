'use client'

import { useProfile } from '@/hooks/useProfile'
import { usePrivy } from '@privy-io/react-auth'
import { useNFTTiers } from '@/hooks/useNFTTiers'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Suspense, useState } from 'react'
import { CreateProfileForm } from './CreateProfileForm'
import { PageContainer } from '@/components/PageContainer'
import { PanelContainer } from '@/components/panels/PanelContainer'
import { FormSkeleton } from '@/components/ui/skeletons/FormSkeleton'

export default function CreateProfilePage() {
  const { isLoading: profileLoading } = useProfile()
  const { ready } = usePrivy()
  const { isLoading: tiersLoading } = useNFTTiers()
  const [isExpanded, setIsExpanded] = useState(true)

  // Show loading state while checking auth and profile
  if (!ready || profileLoading || tiersLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <LoadingSpinner className='w-8 h-8' />
      </div>
    )
  }

  return (
    <PageContainer>
      <PanelContainer>
        <Suspense fallback={<FormSkeleton />}>
          <CreateProfileForm isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        </Suspense>
      </PanelContainer>
    </PageContainer>
  )
}
