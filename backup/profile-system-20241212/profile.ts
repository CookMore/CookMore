'use client'

import { type Profile, ProfileTier, type TierStatus } from '@/app/api/types/profile'
import { getAddresses } from '@/lib/web3/utils/addresses'
import { ethers } from 'ethers'
import { PROFILE_REGISTRY_ABI, GROUP_NFT_ABI } from '@/lib/web3/abis'

interface ProfileResponse {
  success: boolean
  data: Profile | null
  error?: string
  tierStatus: TierStatus
}

class ProfileEdgeService {
  private provider: ethers.JsonRpcProvider
  private addresses: ReturnType<typeof getAddresses>

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL)
    this.addresses = getAddresses()
  }

  async getProfile(address: string): Promise<ProfileResponse> {
    try {
      const nftContract = new ethers.Contract(
        this.addresses.GROUP_NFT,
        GROUP_NFT_ABI,
        this.provider
      )

      const balance = await nftContract.balanceOf(address)
      let tokenId
      let isGroup = false

      if (balance > 0) {
        tokenId = await nftContract.tokenOfOwnerByIndex(address, 0)
        isGroup = await nftContract.isGroupTier(tokenId)
      }

      const profileContract = new ethers.Contract(
        this.addresses.PROFILE_REGISTRY,
        PROFILE_REGISTRY_ABI,
        this.provider
      )

      const profile = await profileContract.getProfile(address)

      return {
        success: true,
        data: profile.exists ? profile : null,
        tierStatus: {
          hasGroup: balance > 0 && isGroup,
          hasPro: balance > 0 && !isGroup,
          currentTier:
            balance > 0 ? (isGroup ? ProfileTier.GROUP : ProfileTier.PRO) : ProfileTier.FREE,
        },
      }
    } catch (error) {
      console.error('Error checking profile:', error)
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

export const profileEdgeService = new ProfileEdgeService()
