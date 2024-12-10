'use client'

import { useQuery } from '@tanstack/react-query'
import { ProfileService } from '@/lib/services/profile'
import type { ProfileTier } from '@/types/profile'

export function useProfileSystem(address: string | undefined) {
  const { 
    data: profile,
    isLoading: isProfileLoading
  } = useQuery({
    queryKey: ['profile', address],
    queryFn: () => address ? ProfileService.getProfile(address) : Promise.resolve(null),
    enabled: !!address
  })

  const tier = profile?.data?.metadata.tier
  const isProfileCreated = !!tier
  const canUpgrade = tier === ProfileTier.FREE
  const canCreateGroup = tier === ProfileTier.PRO

  return {
    tier,
    isProfileLoading,
    isProfileCreated,
    canUpgrade,
    canCreateGroup
  }
}
