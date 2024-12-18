'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { useProfileRegistry } from '@/app/[locale]/(authenticated)/profile/components/hooks'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { profileABI } from '@/app/api/blockchain/abis/profile'
import { TIER_CONTRACT_ABI } from '../contracts/abis'

interface ProfileContextType {
  address?: string
  isConnected: boolean
  currentTier: ProfileTier
  tiersLoading: boolean
  hasProfile: boolean
  profileLoading: boolean
  isLoading: boolean
  profile?: Profile
  createProfile: (data: any, tier: ProfileTier) => Promise<string>
  updateProfile: (data: any, tier: ProfileTier) => Promise<string>
  getProfile: (profileId: string) => Promise<any>
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount()
  const { currentTier, isLoading: tiersLoading } = useNFTTiers()
  const {
    createProfile,
    updateProfile,
    getProfile,
    isLoading: profileLoading,
    contract,
  } = useProfileRegistry()
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<Profile>()
  const [hasProfile, setHasProfile] = useState(false)

  // Client-side mounting check
  useEffect(() => {
    setMounted(true)
  }, [])

  // Use wagmi's useContractRead for profile data
  const { data: profileData, isError } = useContractRead({
    address: contract?.address as `0x${string}`,
    abi: profileABI,
    functionName: 'getProfile',
    args: address ? [address] : undefined,
    enabled: mounted && !!address && !!contract?.address,
  })

  // Update profile state when data changes
  useEffect(() => {
    if (!mounted) return

    if (profileData) {
      setHasProfile(profileData.exists)
      if (profileData.exists) {
        setProfile({
          id: profileData.profileId?.toString(),
          wallet: address,
          metadataURI: profileData.metadataURI,
          tier: profileData.tier,
        })
      }
    } else if (isError) {
      setHasProfile(false)
      setProfile(undefined)
    }
  }, [profileData, isError, address, mounted])

  // Don't render anything until mounted
  if (!mounted) return null

  return (
    <ProfileContext.Provider
      value={{
        address,
        isConnected,
        currentTier,
        tiersLoading,
        hasProfile,
        profileLoading,
        isLoading: tiersLoading || profileLoading,
        profile,
        createProfile,
        updateProfile,
        getProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
