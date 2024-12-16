'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useNFTTiers } from '@/lib/web3/hooks/features/useNFTTiers'
import { useProfileRegistry } from '@/lib/web3/hooks/features/useProfileRegistry'
import { ProfileTier } from '@/app/api/types/profile'

interface ProfileContextType {
  address?: string
  isConnected: boolean
  currentTier: ProfileTier
  tiersLoading: boolean
  hasProfile: boolean
  profileLoading: boolean
}

const ProfileContext = createContext<ProfileContextType>({
  isConnected: false,
  currentTier: ProfileTier.FREE,
  tiersLoading: false,
  hasProfile: false,
  profileLoading: false,
})

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount()
  const { currentTier, isLoading: tiersLoading } = useNFTTiers()
  const { hasProfile, isLoading: profileLoading } = useProfileRegistry()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ProfileContext.Provider
      value={{
        address,
        isConnected,
        currentTier,
        tiersLoading,
        hasProfile,
        profileLoading,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext)
}
