'use client'

import { createContext, useContext, useMemo } from 'react'
import { useNFTTiers } from '@/hooks/useNFTTiers'
import { ProfileTier } from '@/types/profile'

interface ProfileContextType {
  tier: ProfileTier
  isLoading: boolean
  error: Error | null
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { hasPro, hasGroup, isLoading, error } = useNFTTiers()

  const tier = useMemo<ProfileTier>(() => {
    if (hasGroup) return ProfileTier.GROUP
    if (hasPro) return ProfileTier.PRO
    return ProfileTier.FREE
  }, [hasPro, hasGroup])

  return (
    <ProfileContext.Provider value={{ tier, isLoading, error }}>{children}</ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider')
  }
  return context
}
