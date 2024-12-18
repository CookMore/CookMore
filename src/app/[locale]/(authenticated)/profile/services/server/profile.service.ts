'use server'

import { getServerContract } from '@/app/api/blockchain/server/getContracts'
import { profileABI, tierABI, accessABI } from '@/app/api/blockchain/abis'
import { cache } from 'react'
import type { Profile, ProfileTier, TierStatus } from '../../profile'
import { getContractAddress } from '@/app/api/blockchain/utils/addresses'

// Role constants
const ROLES = {
  ADMIN: '0x0000000000000000000000000000000000000000000000000000000000000000',
  METADATA_MANAGER: '0x109d2839f0e9c0989a65f47c368d7b5e99e4d7ccf6f4e87443bad305e3c76f8e',
  PROFILE_MANAGER: '0x2d46c56e9f7e96c2c1cfc78c45b65c1e93bb34de2c4ba58e7bc3896fd245e1d6',
} as const

export interface ProfileResponse {
  success: boolean
  data: Profile | null
  error?: string
  tierStatus: TierStatus
  isAdmin?: boolean
  canManageProfiles?: boolean
  canManageMetadata?: boolean
}

// Helper function to check role access
async function checkRoleAccess(address: string): Promise<{
  isAdmin: boolean
  canManageProfiles: boolean
  canManageMetadata: boolean
}> {
  try {
    const accessControlContract = await getServerContract({
      address: getContractAddress('ACCESS_CONTROL'),
      abi: accessABI,
    })

    const [isAdmin, canManageProfiles, canManageMetadata] = await Promise.all([
      accessControlContract.hasRole(ROLES.ADMIN, address),
      accessControlContract.hasRole(ROLES.PROFILE_MANAGER, address),
      accessControlContract.hasRole(ROLES.METADATA_MANAGER, address),
    ])

    return {
      isAdmin,
      canManageProfiles,
      canManageMetadata,
    }
  } catch (error) {
    console.error('Error checking role access:', error)
    return {
      isAdmin: false,
      canManageProfiles: false,
      canManageMetadata: false,
    }
  }
}

// Helper function to get tier status
async function getTierStatus(address: string, contract: any): Promise<TierStatus> {
  try {
    const balance = await contract.balanceOf(address).catch(() => BigInt(0))

    if (balance === BigInt(0)) {
      return { hasGroup: false, hasPro: false, currentTier: ProfileTier.FREE }
    }

    const tokenId = balance - BigInt(1)
    const isGroup = await contract.isGroupTier(tokenId).catch(() => false)

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
    const [profile, tierStatus, roleAccess] = await Promise.all([
      profileContract.getProfile(address).catch(() => null),
      getTierStatus(address, tierContract),
      checkRoleAccess(address),
    ])

    return {
      success: true,
      data: profile,
      tierStatus,
      ...roleAccess,
    }
  } catch (error) {
    console.error('Error in getProfile:', error)
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
  createProfile: async (metadata: any) => {
    // Implement profile creation logic
    return { success: true, hash: '0x' }
  },
  updateProfile: async (metadata: any) => {
    // Implement profile update logic
    return { success: true, hash: '0x' }
  },
  deleteProfile: async () => {
    // Implement profile deletion logic
    return { success: true }
  },
}
