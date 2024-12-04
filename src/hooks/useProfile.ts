'use client'

import { useCallback, useState, useEffect } from 'react'
import { createProfile, updateProfile, getProfile, upgradeProfile } from '@/lib/services/profile'
import { ProfileTier } from '@/types/profile'
import type {
  ProfileMetadata,
  ProfileResponse,
  FreeProfileMetadata,
  ProProfileMetadata,
  GroupProfileMetadata,
} from '@/types/profile'
import { useNFTTiers } from './useNFTTiers'
import { usePrivy } from '@privy-io/react-auth'
import { useWalletState } from '@/hooks/useWalletState'

const ADMIN_WALLET = '0x1920F5b512634DE346100b025382c04eEA8Bbc67'

type ProfileDataType = {
  [ProfileTier.FREE]: FreeProfileMetadata
  [ProfileTier.PRO]: ProProfileMetadata
  [ProfileTier.GROUP]: GroupProfileMetadata
}

export function useProfile() {
  const { hasPro, hasGroup, isLoading: tiersLoading } = useNFTTiers()
  const { user, authenticated } = usePrivy()
  const [currentTier, setCurrentTier] = useState<ProfileTier>(ProfileTier.FREE)
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileMetadata | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { address } = useWalletState()

  // Check if current user is admin
  const isAdmin = user?.wallet?.address?.toLowerCase() === ADMIN_WALLET.toLowerCase()

  // Tier checking logic - Updated to bypass for admin
  const canAccessTier = useCallback(
    (tier: ProfileTier) => {
      // Admin can access all tiers
      if (isAdmin) return true

      switch (tier) {
        case ProfileTier.FREE:
          return true
        case ProfileTier.PRO:
          return hasPro
        case ProfileTier.GROUP:
          return hasGroup
        default:
          return false
      }
    },
    [hasPro, hasGroup, isAdmin]
  )

  // Effect to sync wallet tier with profile
  useEffect(() => {
    if (!tiersLoading && user?.wallet) {
      const tier = hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE
      setCurrentTier(tier)
      setIsLoading(false)
    }
  }, [tiersLoading, hasGroup, hasPro, user?.wallet])

  // Type-safe create function
  const handleCreate = useCallback(
    async <T extends ProfileTier>(metadata: ProfileDataType[T], tier: T) => {
      if (!user?.wallet?.address) {
        throw new Error('No wallet address')
      }
      if (!canAccessTier(tier)) {
        throw new Error('Cannot create profile: insufficient tier access')
      }
      try {
        const result = await createProfile(metadata)
        if (result.data) {
          setProfile(result.data)
        }
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create profile')
        setError(error)
        throw error
      }
    },
    [canAccessTier, user?.wallet?.address]
  )

  const handleUpdate = useCallback(
    async (data: ProfileMetadata) => {
      if (!user?.wallet?.address) throw new Error('No wallet address')
      return updateProfile(data)
    },
    [user?.wallet?.address]
  )

  const handleGet = useCallback(async () => {
    if (!user?.wallet?.address) throw new Error('No wallet address')
    return getProfile()
  }, [user?.wallet?.address])

  const handleUpgrade = useCallback(
    async (newTier: ProfileTier) => {
      if (!user?.wallet?.address) throw new Error('No wallet address')
      if (!canAccessTier(newTier)) {
        throw new Error('Cannot upgrade: insufficient tier access')
      }
      return upgradeProfile(newTier)
    },
    [canAccessTier, user?.wallet?.address]
  )

  const fetchProfile = useCallback(
    async (walletAddress?: string) => {
      // Don't fetch if no address is available
      if (!walletAddress && !address) {
        setLoading(false)
        setProfile(null)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const targetAddress = walletAddress || address

        const response = await fetch(`/api/profile?walletAddress=${targetAddress}`, {
          headers: {
            'x-wallet-address': targetAddress || '',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }

        const data = await response.json()

        // Successfully fetched, but no profile exists
        if (!data.profile) {
          setProfile(null)
          return
        }

        setProfile(data.profile)
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError(err instanceof Error ? err : new Error('Failed to fetch profile'))
        setProfile(null)
      } finally {
        setLoading(false)
      }
    },
    [address]
  )

  // Only fetch when address is available
  useEffect(() => {
    if (address) {
      fetchProfile(address)
    } else {
      // Clear profile when no address is available
      setProfile(null)
      setLoading(false)
    }
  }, [address, fetchProfile])

  // Add debug logging
  useEffect(() => {
    console.log('Profile State:', {
      loading,
      error: error?.message,
      profile: profile ? 'exists' : 'null',
      address,
    })
  }, [loading, error, profile, address])

  useEffect(() => {
    console.log('D. Profile State:', {
      isLoading,
      hasProfile: !!profile,
      walletAddress: user?.wallet?.address,
    })
  }, [isLoading, profile, user?.wallet?.address])

  return {
    // Profile operations
    createProfile: handleCreate,
    updateProfile: handleUpdate,
    getProfile: handleGet,
    upgradeProfile: handleUpgrade,

    // Tier management
    currentTier,
    canAccessTier,
    isLoading: isLoading || tiersLoading,

    // Tier status
    hasProAccess: hasPro,
    hasGroupAccess: hasGroup,

    // Profile data
    profile,
    error,
    loading,
    refetch: fetchProfile,
  }
}
