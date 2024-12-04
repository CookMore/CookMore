import { profileRegistry } from '@/lib/web3/contracts/profile-registry'
import { getContractAddress } from '@/lib/web3/addresses'
import type { Profile } from '@/lib/web3/abi/profile-registry'
import { publicClient } from '@/lib/web3/client'

class ProfileVerificationService {
  private static VERIFICATION_CACHE_KEY = 'profile_verification_cache'
  private static CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

  async verifyProfileOwnership(address: `0x${string}`, tokenId: bigint): Promise<boolean> {
    try {
      const owner = await profileRegistry.ownerOf(tokenId)
      return owner.toLowerCase() === address.toLowerCase()
    } catch {
      return false
    }
  }

  async verifyProfileTier(profile: Profile, expectedTier: string): Promise<boolean> {
    try {
      // Check cache first
      const cached = this.getVerificationFromCache(profile.tokenId.toString())
      if (cached?.tier === expectedTier) return true

      const currentTier = profile.tier
      const isValid = currentTier === expectedTier

      if (isValid) {
        this.setVerificationCache(profile.tokenId.toString(), { tier: expectedTier })
      }

      return isValid
    } catch {
      return false
    }
  }

  async verifyProfileMetadata(profile: Profile, metadataURI: string): Promise<boolean> {
    try {
      const storedURI = await profileRegistry.tokenURI(profile.tokenId)
      return storedURI === metadataURI
    } catch {
      return false
    }
  }

  async getProfileVerificationStatus(
    address: `0x${string}`,
    profile: Profile
  ): Promise<{
    isOwner: boolean
    hasValidTier: boolean
    hasValidMetadata: boolean
    isVerified: boolean
  }> {
    const [isOwner, hasValidTier, hasValidMetadata] = await Promise.all([
      this.verifyProfileOwnership(address, profile.tokenId),
      this.verifyProfileTier(profile, profile.tier),
      this.verifyProfileMetadata(profile, profile.metadataURI),
    ])

    return {
      isOwner,
      hasValidTier,
      hasValidMetadata,
      isVerified: isOwner && hasValidTier && hasValidMetadata,
    }
  }

  // Cache management
  private getVerificationFromCache(tokenId: string): { tier: string } | null {
    const cached = localStorage.getItem(
      `${ProfileVerificationService.VERIFICATION_CACHE_KEY}_${tokenId}`
    )
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > ProfileVerificationService.CACHE_DURATION) {
      localStorage.removeItem(`${ProfileVerificationService.VERIFICATION_CACHE_KEY}_${tokenId}`)
      return null
    }

    return data
  }

  private setVerificationCache(tokenId: string, data: { tier: string }) {
    localStorage.setItem(
      `${ProfileVerificationService.VERIFICATION_CACHE_KEY}_${tokenId}`,
      JSON.stringify({ data, timestamp: Date.now() })
    )
  }

  // Signature verification for profile updates
  async verifyProfileUpdateSignature(
    address: `0x${string}`,
    tokenId: bigint,
    signature: `0x${string}`
  ): Promise<boolean> {
    try {
      const message = `Update profile ${tokenId.toString()} at ${Date.now()}`
      const verified = await publicClient.verifyMessage({
        address,
        message,
        signature,
      })
      return verified
    } catch {
      return false
    }
  }
}

export const profileVerificationService = new ProfileVerificationService()
