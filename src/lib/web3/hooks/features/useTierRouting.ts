'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useNFTTiers } from './useNFTTiers'
import { useProfile } from '@/app/providers/ProfileProvider'
import { ProfileTier } from '@/types/profile'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export interface TierRoutingResult {
  isLoading: boolean
  currentTier: ProfileTier
}

export function useTierRouting(): TierRoutingResult {
  const t = useTranslations('profile')
  const router = useRouter()
  const { hasGroup, hasPro, isLoading: tiersLoading } = useNFTTiers()
  const { profile, isLoading: profileLoading } = useProfile()

  useEffect(() => {
    if (tiersLoading || profileLoading) return

    try {
      if (!profile) {
        if (hasGroup) {
          router.replace(`/profile/create?tier=${ProfileTier.GROUP}`)
          toast.info(t('routing.createGroup'))
        } else if (hasPro) {
          router.replace(`/profile/create?tier=${ProfileTier.PRO}`)
          toast.info(t('routing.createPro'))
        } else {
          router.replace(`/profile/create?tier=${ProfileTier.FREE}`)
          toast.info(t('routing.createFree'))
        }
      } else {
        if (!hasGroup && !hasPro) {
          router.replace('/profile/tier')
          toast.info(t('routing.upgrade'))
        } else {
          router.replace('/profile')
        }
      }
    } catch (error) {
      console.error('Error in tier routing:', error)
      toast.error(t('routing.error'))
    }
  }, [hasGroup, hasPro, profile, tiersLoading, profileLoading, router, t])

  return {
    isLoading: tiersLoading || profileLoading,
    currentTier: hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE,
  }
}
