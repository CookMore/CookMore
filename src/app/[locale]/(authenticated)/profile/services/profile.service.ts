'use client'

import {
  type Profile,
  ProfileTier,
  type TierStatus,
} from '@/app/[locale]/(authenticated)/profile/profile'
import { getAddresses } from '@/app/api/web3/utils/addresses'
import { ethers } from 'ethers'
import { PROFILE_REGISTRY_ABI, GROUP_NFT_ABI } from '@/app/api/web3/abis'
import { cache } from 'react'
import type { EdgeServiceOptions } from '@/app/api/services/types'

export interface ProfileResponse {
  success: boolean
  data: Profile | null
  error?: string
  tierStatus: TierStatus
}

// Singleton instances reused across requests
let provider: ethers.JsonRpcProvider
let addresses: ReturnType<typeof getAddresses>

// Initialize provider and addresses only once
function getProvider() {
  if (!provider) {
    const rpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL
    if (!rpcUrl) {
      throw new Error('RPC URL not configured')
    }
    provider = new ethers.JsonRpcProvider(rpcUrl, {
      name: 'base-sepolia',
      chainId: 84532,
    })
  }
  return provider
}

function getContractAddresses() {
  if (!addresses) {
    addresses = getAddresses()
  }
  return addresses
}

// Base implementation shared between edge and client
async function getProfileImpl(address: string): Promise<ProfileResponse> {
  try {
    const provider = getProvider()
    const addresses = getContractAddresses()
    await provider.ready

    let hasGroup = false
    let hasPro = false
    let currentTier = ProfileTier.FREE
    let profileData = null

    // Check NFT ownership first
    const nftContract = new ethers.Contract(addresses.GROUP_NFT, GROUP_NFT_ABI, provider)
    const balance = await nftContract.balanceOf(address).catch(() => BigInt(0))

    if (balance > 0) {
      const isGroup = await nftContract.isGroupTier(balance - BigInt(1)).catch(() => false)
      hasGroup = isGroup
      hasPro = !isGroup
      currentTier = isGroup ? ProfileTier.GROUP : ProfileTier.PRO
    }

    // Then check profile
    try {
      const profileContract = new ethers.Contract(
        addresses.PROFILE_REGISTRY,
        PROFILE_REGISTRY_ABI,
        provider
      )
      const profile = await profileContract.getProfile(address)
      if (profile?.exists) {
        profileData = profile
      }
    } catch (error) {
      console.warn('Profile not found:', error)
    }

    return {
      success: true,
      data: profileData,
      tierStatus: { hasGroup, hasPro, currentTier },
    }
  } catch (error) {
    console.error('Error in getProfileImpl:', error)
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch profile',
      tierStatus: { hasGroup: false, hasPro: false, currentTier: ProfileTier.FREE },
    }
  }
}

// Edge service implementation
export class ProfileEdgeService {
  async getProfile(address: string, options?: EdgeServiceOptions): Promise<ProfileResponse> {
    return getProfileImpl(address)
  }

  async invalidateProfile(address: string): Promise<void> {
    // Implementation for cache invalidation will be added later
  }
}

// Client service implementation
export class ProfileService {
  private edgeService: ProfileEdgeService

  constructor() {
    this.edgeService = new ProfileEdgeService()
  }

  async getProfile(address: string): Promise<ProfileResponse> {
    try {
      const response = await this.edgeService.getProfile(address)
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch profile')
      }
      return response
    } catch (error) {
      console.error('Profile Service Error:', error)
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
        tierStatus: {
          hasGroup: false,
          hasPro: false,
          currentTier: ProfileTier.FREE,
        },
      }
    }
  }
}

// Server-side cached implementation
export const getProfile = cache(getProfileImpl)

// Export singleton instances
export const profileEdgeService = new ProfileEdgeService()
export const profileService = new ProfileService()
