'use client'

import { useCallback } from 'react'
import { useProfileSystem } from '@/hooks/useProfileSystem'
import type { ProfileMetadata, ProfileTier } from '@/types/profile'

export function useProfileComplete() {
  const { handleProfileSubmit } = useProfileSystem()

  const handleProfileComplete = useCallback(
    async (metadata: ProfileMetadata, tier: ProfileTier) => {
      try {
        // Add tier to metadata
        const submissionData = {
          ...metadata,
          tier,
        }
        await handleProfileSubmit(submissionData, tier)
      } catch (error) {
        console.error('Profile completion error:', error)
        throw error
      }
    },
    [handleProfileSubmit]
  )

  return {
    handleProfileComplete,
    isReady: true,
  }
}
