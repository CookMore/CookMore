'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useNFTTiers } from './useNFTTiers'
import { useProfile } from '@/app/providers/ProfileProvider'
import { ProfileTier } from '@/types/profile'

export function useTierRouting() {
  const router = useRouter()
  const { hasGroup, hasPro, isLoading: tiersLoading } = useNFTTiers()
  const { profile, isLoading: profileLoading } = useProfile()

  useEffect(() => {
    if (tiersLoading || profileLoading) return

    // Determine routing based on profile existence and tier ownership
    if (!profile) {
      // No profile exists - route based on highest tier owned
      if (hasGroup) {
        router.replace(`/profile/create?tier=${ProfileTier.GROUP}`)
      } else if (hasPro) {
        router.replace(`/profile/create?tier=${ProfileTier.PRO}`)
      } else {
        router.replace(`/profile/create?tier=${ProfileTier.FREE}`)
      }
    } else {
      // Profile exists - check if they need to upgrade
      if (!hasGroup && !hasPro) {
        // Has free profile but no higher tier tokens
        router.replace('/profile/tier')
      } else {
        // Has profile and appropriate tier tokens
        router.replace('/profile')
      }
    }
  }, [hasGroup, hasPro, profile, tiersLoading, profileLoading, router])

  return {
    isLoading: tiersLoading || profileLoading,
    currentTier: hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE,
  }
}
