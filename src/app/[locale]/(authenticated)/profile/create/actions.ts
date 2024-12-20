'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ProfileTier,
  type ProfileFormData,
  type ProfileMetadata,
} from '@/app/[locale]/(authenticated)/profile/profile'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks'

export function useProfileComplete() {
  const router = useRouter()
  const { createProfile } = useProfile()

  const handleProfileComplete = useCallback(
    async (formData: ProfileFormData, tier: ProfileTier) => {
      try {
        // Transform form data to metadata format
        const metadata: ProfileMetadata = {
          ...formData,
          tier,
          version: '1.2',
          social: {
            urls: [],
            labels: [],
          },
          preferences: {
            theme: 'light',
            notifications: true,
            displayEmail: false,
            displayLocation: false,
          },
          achievements: {
            recipesCreated: 0,
            recipesForked: 0,
            totalLikes: 0,
            badges: [],
          },
        }

        const hash = await createProfile(metadata)

        if (!hash) {
          throw new Error('Failed to create profile')
        }

        toast.success('Profile created successfully!', {
          description: 'Redirecting to your profile...',
        })

        router.push('/profile')
        return { success: true, hash }
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
