'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useProfileData } from '@/lib/auth/hooks/useProfile'
import { useNFTTiers } from '@/lib/web3/hooks/useNFTTiers'
import { ProfileTier } from '@/types/profile'
import type { Profile } from '@/types/profile'

interface ProfileContextType {
  profile: Profile | undefined
  currentTier: ProfileTier
  canAccessTier: (tier: ProfileTier) => boolean
  isLoading: boolean
  error: Error | null
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, authenticated, ready } = usePrivy()
  const { hasPro, hasGroup, isLoading: tiersLoading } = useNFTTiers()
  const {
    profile,
    isLoading: profileLoading,
    error: profileError,
  } = useProfileData(user?.wallet?.address)

  const [currentTier, setCurrentTier] = useState<ProfileTier>(ProfileTier.FREE)
  const isInitialMount = useRef(true)

  // Only update tier when we have all the necessary data
  useEffect(() => {
    if (!ready || !authenticated || tiersLoading) return

    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    let newTier = ProfileTier.FREE
    if (hasGroup) {
      newTier = ProfileTier.GROUP
    } else if (hasPro) {
      newTier = ProfileTier.PRO
    }

    if (newTier !== currentTier) {
      setCurrentTier(newTier)
    }
  }, [ready, authenticated, tiersLoading, hasGroup, hasPro, currentTier])

  const canAccessTier = (tier: ProfileTier): boolean => {
    if (!ready || !authenticated) return false

    switch (tier) {
      case ProfileTier.FREE:
        return true
      case ProfileTier.PRO:
        return hasPro || hasGroup
      case ProfileTier.GROUP:
        return hasGroup
      default:
        return false
    }
  }

  const value = {
    profile,
    currentTier,
    canAccessTier,
    isLoading: !ready || profileLoading || tiersLoading,
    error: profileError,
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
