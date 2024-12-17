'use client'

import { createContext, useContext, ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useProfile } from '@/app/api/providers/ProfileProvider'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { profileSchema } from '@/app/[locale]/(authenticated)/profile/validations/profile'
import type { ProfileFormData } from '@/app/[locale]/(authenticated)/profile/profile'

interface ProfileFormProviderProps {
  children: ReactNode
  tier: ProfileTier
}

interface ProfileFormContextValue {
  currentTier: ProfileTier
  isLoading: boolean
}

const ProfileFormContext = createContext<ProfileFormContextValue | undefined>(undefined)

export function ProfileFormProvider({ children, tier }: ProfileFormProviderProps) {
  const { currentTier, isLoading } = useProfile()

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
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
    },
  })

  return (
    <ProfileFormContext.Provider value={{ currentTier, isLoading }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </ProfileFormContext.Provider>
  )
}

export function useProfileFormContext() {
  const context = useContext(ProfileFormContext)
  if (!context) {
    throw new Error('useProfileFormContext must be used within a ProfileFormProvider')
  }
  return context
}
