'use client'

import { useState } from 'react'
import { useProfile } from './useProfile'
import type {
  ProfileMetadata,
  ProfileTier,
  FreeProfileMetadata,
  ProProfileMetadata,
  GroupProfileMetadata,
} from '@/app/[locale]/(authenticated)/profile/profile'

export function useProfileForm<T extends ProfileMetadata>(address: string, tier: ProfileTier) {
  const { profile, updateProfile, isLoading, isUpdating } = useProfile(address)
  const [currentSection, setCurrentSection] = useState(0)

  const getInitialData = (): T => {
    if (!profile) {
      return {
        tier,
        version: '1.2',
        name: '',
        bio: '',
        avatar: '',
        social: { urls: [], labels: [] },
        preferences: {
          theme: 'system',
          notifications: true,
          displayEmail: false,
          displayLocation: false,
        },
        culinaryInfo: {
          expertise: 'beginner',
          specialties: [],
          dietaryPreferences: [],
          cuisineTypes: [],
          techniques: [],
          equipment: [],
        },
        achievements: {
          recipesCreated: 0,
          recipesForked: 0,
          totalLikes: 0,
          badges: [],
        },
      } as T
    }
    return profile.metadata as T
  }

  const handleSubmit = async (data: Partial<T>) => {
    try {
      const result = await updateProfile(data)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    } catch (error) {
      console.error('Profile form submission error:', error)
      throw error
    }
  }

  return {
    initialData: getInitialData(),
    currentSection,
    setCurrentSection,
    handleSubmit,
    isLoading,
    isUpdating,
  }
}

// Typed versions for different profile tiers
export function useFreeProfileForm(address: string) {
  return useProfileForm<FreeProfileMetadata>(address, ProfileTier.FREE)
}

export function useProProfileForm(address: string) {
  return useProfileForm<ProProfileMetadata>(address, ProfileTier.PRO)
}

export function useGroupProfileForm(address: string) {
  return useProfileForm<GroupProfileMetadata>(address, ProfileTier.GROUP)
}
