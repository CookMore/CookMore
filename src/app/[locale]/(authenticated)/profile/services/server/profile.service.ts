'use server'

import { getServerContract } from '@/app/api/blockchain/server/getContracts'
import { profileABI, tierABI } from '@/app/api/blockchain/abis'
import { cache } from 'react'
import { Profile } from '../../profile'
import { ProfileTier } from '../../profile'
import type { TierStatus } from '../../profile'
import { getContractAddress } from '@/app/api/blockchain/utils/addresses'
import { checkRoleAccess } from '../../utils/role-utils'
import { cookies } from 'next/headers'
import { COOKIE_NAMES } from '@/app/api/utils/cookies'
import { publicClient } from '@/app/api/blockchain/config/client'

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
async function getTierStatus(address: string, contract: any): Promise<TierStatus> {
  try {
    const balance = await publicClient
      .readContract({
        ...contract,
        functionName: 'balanceOf',
        args: [address],
      })
      .catch(() => BigInt(0))

    if (balance === BigInt(0)) {
      return { hasGroup: false, hasPro: false, currentTier: ProfileTier.FREE }
    }

    const tokenId = balance - BigInt(1)
    const isGroup = await publicClient
      .readContract({
        ...contract,
        functionName: 'isGroupTier',
        args: [tokenId],
      })
      .catch(() => false)

    return {
      hasGroup: isGroup,
      hasPro: !isGroup,
      currentTier: isGroup ? ProfileTier.GROUP : ProfileTier.PRO,
    }
  } catch (error) {
    console.error('Error getting tier status:', error)
    return { hasGroup: false, hasPro: false, currentTier: ProfileTier.FREE }
  }
}

// Base implementation for server-side profile fetching
export async function getProfile(address: string): Promise<ProfileResponse> {
  try {
    // Get contracts
    const [profileContract, tierContract] = await Promise.all([
      getServerContract({
        address: getContractAddress('PROFILE_REGISTRY'),
        abi: profileABI,
      }),
      getServerContract({
        address: getContractAddress('GROUP_NFT'),
        abi: tierABI,
      }),
    ])

    // Get profile data and role access in parallel
    const [profileData, tierStatus, roleAccess] = await Promise.all([
      publicClient
        .readContract({
          ...profileContract,
          functionName: 'getProfile',
          args: [address],
        })
        .catch(() => null),
      getTierStatus(address, tierContract),
      checkRoleAccess(address),
    ])

    // Set the HAS_PROFILE cookie based on profile existence
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAMES.HAS_PROFILE, profileData?.exists ? 'true' : 'false', {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    return {
      success: true,
      data: profileData,
      tierStatus,
      ...roleAccess,
    }
  } catch (error) {
    console.error('Error in getProfile:', error)
    // Set HAS_PROFILE to false on error
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAMES.HAS_PROFILE, 'false', {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch profile',
      tierStatus: { hasGroup: false, hasPro: false, currentTier: ProfileTier.FREE },
      isAdmin: false,
      canManageProfiles: false,
      canManageMetadata: false,
    }
  }
}

// Cached version for repeated calls
export const getCachedProfile = cache(getProfile)

// Edge service for client-side operations
export const profileEdgeService = {
  getProfile,
  createProfile: async (metadata: Profile) => {
    // Implement profile creation logic
    return { success: true, hash: '0x' }
  },
  updateProfile: async (metadata: Profile) => {
    // Implement profile update logic
    return { success: true, hash: '0x' }
  },
  deleteProfile: async () => {
    // Implement profile deletion logic
    return { success: true }
  },
}
