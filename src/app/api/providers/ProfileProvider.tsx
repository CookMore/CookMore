'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { useNFTTiers } from '@/app/api/web3/tier'
import { useProfileRegistry } from '@/app/[locale]/(authenticated)/profile/components/hooks'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { PROFILE_REGISTRY_ABI } from '@/app/api/web3/abis/profile'

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

  // Log wallet connection status
  useEffect(() => {
    if (mounted) {
      console.log('Wallet connection status:', {
        address,
        isConnected,
      })
    }
  }, [mounted, address, isConnected])

  // Log tier status
  useEffect(() => {
    if (mounted && !tiersLoading) {
      console.log('NFT tier status:', {
        currentTier,
        tiersLoading,
      })
    }
  }, [mounted, currentTier, tiersLoading])

  // Use wagmi's useContractRead for profile data
  const { data: profileData, isError } = useContractRead({
    address: contract?.address as `0x${string}`,
    abi: PROFILE_REGISTRY_ABI,
    functionName: 'getProfile',
    args: address ? [address] : undefined,
    enabled: !!address && !!contract?.address,
    onSuccess(data) {
      console.log('Profile data fetched:', data)
    },
    onError(error) {
      console.error('Error fetching profile:', error)
    },
  })

  // Update profile state when data changes
  useEffect(() => {
    if (profileData) {
      console.log('Processing profile data:', profileData)
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
      console.log('Profile data error or not found')
      setHasProfile(false)
      setProfile(undefined)
    }
  }, [profileData, isError, address])

  // Don't render anything until mounted
  if (!mounted) return null

  // Implement token gating
  const canAccess = isConnected && (currentTier >= ProfileTier.FREE || hasProfile)

  if (!canAccess) {
    console.log('Access denied:', {
      isConnected,
      currentTier,
      hasProfile,
    })
    return <div>Please connect your wallet and ensure you have the required NFT tier.</div>
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
