'use server'

import { getServerContract } from '@/app/api/blockchain/server/getContracts'
import { profileABI } from '@/app/api/blockchain/abis'
import { cache } from 'react'
import { Profile } from '../../profile'
import { ProfileTier } from '../../profile'
import type { TierStatus } from '../../profile'
import { getContractAddress } from '@/app/api/blockchain/utils/addresses'
import { checkRoleAccess } from '../../utils/role-utils'
import { cookies } from 'next/headers'
import { COOKIE_NAMES } from '@/app/api/utils/cookies'
import { publicClient } from '@/app/api/blockchain/config/client'
import { getTierStatus as getTierStatusFromContract } from '@/app/api/tiers/tiers'

export interface ProfileResponse {
  success: boolean
  data: Profile | null
  error?: string
  tierStatus: TierStatus
  isAdmin?: boolean
  canManageProfiles?: boolean
  canManageMetadata?: boolean
}

// Helper function to get tier status
async function getTierStatus(address: string): Promise<TierStatus> {
  try {
    return await getTierStatusFromContract(address)
  } catch (error) {
    console.error('Error getting tier status:', error)
    return {
      hasGroup: false,
      hasPro: false,
      hasOG: false,
      currentTier: ProfileTier.FREE,
    }
  }
}

// Base implementation for server-side profile fetching
export async function getProfile(address: string): Promise<ProfileResponse> {
  console.log('Starting getProfile for address:', address)

  try {
    const contract = (await getServerContract({
      address: getContractAddress('PROFILE_REGISTRY'),
      abi: profileABI,
    })) as any

    if (!contract?.read) {
      console.error('Contract or read methods not available')
      return {
        success: true,
        data: null,
        tierStatus: {
          hasGroup: false,
          hasPro: false,
          hasOG: false,
          currentTier: 0,
        },
      }
    }

    // Check if profile exists in contract
    let profileId
    try {
      profileId = await contract.read.getProfileId([address])
      console.log('Profile ID check:', {
        profileId: profileId?.toString(),
        address,
      })
    } catch (error) {
      console.error('Error reading profile ID:', error)
      return {
        success: true,
        data: null,
        tierStatus: {
          hasGroup: false,
          hasPro: false,
          hasOG: false,
          currentTier: 0,
        },
      }
    }

    const exists = profileId > 0n

    if (!exists) {
      console.log('No valid profile found for address:', address)
      return {
        success: true,
        data: null,
        tierStatus: {
          hasGroup: false,
          hasPro: false,
          hasOG: false,
          currentTier: 0,
        },
      }
    }

    // Verify the profile by checking if it has valid metadata
    let metadataURI
    try {
      metadataURI = await contract.read.tokenURI([profileId])
    } catch (error) {
      console.error('Failed to get metadata URI:', error)
      return {
        success: true,
        data: null,
        tierStatus: {
          hasGroup: false,
          hasPro: false,
          hasOG: false,
          currentTier: 0,
        },
      }
    }

    const tierStatus = await getTierStatus(address)

    return {
      success: true,
      data: {
        exists: true,
        wallet: address,
        metadataURI,
        tier: 0,
      },
      tierStatus,
    }
  } catch (error) {
    console.error('Error in getProfile:', error)
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      tierStatus: {
        hasGroup: false,
        hasPro: false,
        hasOG: false,
        currentTier: 0,
      },
    }
  }
}

// Cached version for repeated calls
export async function getCachedProfile(address: string): Promise<ProfileResponse> {
  const cachedFn = cache(getProfile)
  return cachedFn(address)
}

// Server actions for profile operations
export async function createProfile(metadata: Profile) {
  try {
    const profileContract = await getServerContract({
      address: getContractAddress('PROFILE_REGISTRY'),
      abi: profileABI,
    })

    // TODO: Implement actual contract interaction
    return { success: true, hash: '0x' }
  } catch (error) {
    console.error('Error creating profile:', error)
    return { success: false, error: 'Failed to create profile' }
  }
}

export async function updateProfile(metadata: Profile) {
  try {
    const profileContract = await getServerContract({
      address: getContractAddress('PROFILE_REGISTRY'),
      abi: profileABI,
    })

    // TODO: Implement actual contract interaction
    return { success: true, hash: '0x' }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}

export async function deleteProfile() {
  try {
    const profileContract = await getServerContract({
      address: getContractAddress('PROFILE_REGISTRY'),
      abi: profileABI,
    })

    // TODO: Implement actual contract interaction
    return { success: true }
  } catch (error) {
    console.error('Error deleting profile:', error)
    return { success: false, error: 'Failed to delete profile' }
  }
}
