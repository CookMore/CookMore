'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { usePrivy } from '@privy-io/react-auth'
import { ProfileDisplay } from '../../components/ui/ProfileDisplay'
import { ProfileSkeleton } from '../../components/ui/ProfileSkeleton'
import { PanelContainer } from '@/app/api/panels/PanelContainer'
import { PageHeader } from '@/app/api/header/PageHeader'
import ProfilePage from '../../page'

export default function PublicProfilePage() {
  const params = useParams()
  console.log('Params:', params)
  const { address } = params
  console.log('Address from Params:', address)

  const { user } = usePrivy()
  const walletAddress = user?.wallet?.address || address

  const { hasProfile, currentTier } = useAuth()

  return (
    <div>
      <PageHeader title={user?.wallet?.address || 'Chef Profile'} />
      <PanelContainer>
        <Suspense fallback={<ProfileSkeleton />}>
          {walletAddress && <ProfilePage address={String(walletAddress)} />}
          {user && (
            <ProfileDisplay
              profile={user}
              currentTier={currentTier}
              isPublicView
              hasProfile={hasProfile}
            />
          )}
        </Suspense>
        <button className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'>Test</button>
      </PanelContainer>
    </div>
  )
}
