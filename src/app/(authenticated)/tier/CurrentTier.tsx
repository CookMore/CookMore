'use client'

import { useNFTTiers } from '@/lib/web3/hooks/useNFTTiers'
import { TierBadge } from '@/components/ui/TierBadge'
import { TierCard } from '@/components/ui/TierCard'
import { ProfileTier } from '@/types/profile'

export default function CurrentTier() {
  const { hasGroup, hasPro, isLoading } = useNFTTiers()
  const currentTier = hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <h2 className='text-2xl font-bold'>Current Tier</h2>
        <TierBadge tier={currentTier} />
      </div>
      <TierCard tier={currentTier} currentTier={currentTier} />
    </div>
  )
}
