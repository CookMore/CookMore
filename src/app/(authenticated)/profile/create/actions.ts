'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ProfileTier, type GroupProfileMetadata } from '@/types/profile'
import { useProfileRegistry } from '@/lib/web3/hooks/useProfileRegistry'

export function useProfileComplete() {
  const router = useRouter()
  const { createProfile } = useProfileRegistry()

  const handleProfileComplete = useCallback(
    async (data: GroupProfileMetadata, tier: ProfileTier) => {
      try {
        const result = await createProfile(data, tier)

        if (!result.success) {
          throw new Error(result.error || 'Failed to create profile')
        }

        toast.success('Profile created successfully!', {
          description: 'Redirecting to your profile...',
        })

        router.push('/profile')
        return result
      } catch (error) {
        console.error('Error creating profile:', error)
        toast.error('Error creating profile', {
          description: 'Please try again later',
        })
        throw error
      }
    },
    [createProfile, router]
  )

  return { handleProfileComplete }
}
