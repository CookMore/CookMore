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
    console.log('Checking tier status for address:', address)

    // Get the balance of tokens for this address
    const balance = (await publicClient
      .readContract({
        ...contract,
        functionName: 'balanceOf',
        args: [address],
      })
      .catch(() => BigInt(0))) as bigint

    console.log('Token balance:', balance.toString())

    if (balance === BigInt(0)) {
      return { hasGroup: false, hasPro: false, hasOG: false, currentTier: ProfileTier.FREE }
    }

    // Since we know there are tokens, let's try to get their tiers
    // We'll try token IDs from 0 to balance*2 to account for any gaps
    const maxTokenId = Number(balance) * 2
    const tiers = []

    for (let i = 0; i < maxTokenId; i++) {
      try {
        const tier = (await publicClient.readContract({
          ...contract,
          functionName: 'tokenTier',
          args: [BigInt(i)],
        })) as string

        if (tier) {
          console.log(`Token ${i} tier:`, tier)
          tiers.push({ tokenId: BigInt(i), tier })
        }
      } catch (error) {
        // Skip if token doesn't exist or other error
        continue
      }
    }

    console.log('Found tiers:', tiers)

    // Determine highest tier status
    const hasOG = tiers.some(({ tier }) => tier === 'OG')
    const hasGroup = tiers.some(({ tier }) => tier === 'Group')
    const hasPro = tiers.some(({ tier }) => tier === 'Pro')

    // Determine current tier (highest takes precedence)
    const currentTier = hasOG
      ? ProfileTier.OG
      : hasGroup
        ? ProfileTier.GROUP
        : hasPro
          ? ProfileTier.PRO
          : ProfileTier.FREE

    console.log('Final tier status:', {
      hasOG,
      hasGroup,
      hasPro,
      currentTier,
    })

    return {
      hasGroup,
      hasPro,
      hasOG,
      currentTier,
    }
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
  try {
    console.log('Starting getProfile for address:', address)

    // Get contracts
    const [profileContract, tierContract] = await Promise.all([
      getServerContract({
        address: getContractAddress('PROFILE_REGISTRY'),
        abi: profileABI,
      }),
      getServerContract({
        address: getContractAddress('TIER_CONTRACT'),
        abi: tierABI,
      }),
    ])

    console.log('Contracts initialized:', {
      profileContract: profileContract.address,
      tierContract: tierContract.address,
      envTierAddress: process.env.NEXT_PUBLIC_TESTNET_TIER_CONTRACT,
    })

    // Get profile data and role access in parallel
    const [profileData, tierStatus, roleAccess] = await Promise.all([
      publicClient
        .readContract({
          ...profileContract,
          functionName: 'getProfile',
          args: [address],
        })
        .catch((error) => {
          console.error('Error reading profile contract:', error)
          return null
        }),
      getTierStatus(address, tierContract),
      checkRoleAccess(address),
    ])

    console.log('Profile data fetched:', {
      profileExists: profileData?.exists,
      tierStatus,
      roleAccess,
    })

    // Set the HAS_PROFILE cookie based on profile existence
    const cookieStore = await cookies()
    const hasProfile = profileData?.exists ? 'true' : 'false'
    console.log('Setting HAS_PROFILE cookie:', hasProfile)

    cookieStore.set(COOKIE_NAMES.HAS_PROFILE, hasProfile, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    return {
      success: true,
      data: profileData?.exists ? profileData : null,
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
      tierStatus: { hasGroup: false, hasPro: false, hasOG: false, currentTier: ProfileTier.FREE },
      isAdmin: false,
      canManageProfiles: false,
      canManageMetadata: false,
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
