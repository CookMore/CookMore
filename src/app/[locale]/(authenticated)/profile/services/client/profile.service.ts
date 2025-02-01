'use client'

import { JsonRpcProvider } from 'ethers'
import { decodeProfileEvent } from '@/app/api/blockchain/utils/eventDecoder'
import { profileCacheService } from '@/app/[locale]/(authenticated)/profile/services/offline/profile-cache.service'
import type { ProfileMetadata } from '@/app/[locale]/(authenticated)/profile/profile'
import { toast } from 'sonner' // If you're using Sonner for notifications
import { profileABI } from '@/app/api/blockchain/abis/profile' // Import profileABI

/**
 * Example: If you have different RPC endpoints for mainnet and sepolia
 * environment variables, ensure they are set in your .env.
 */
const MAINNET_RPC_URL = process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL || ''
const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || ''

// Initialize Ethers v6 providers
const mainnetProvider = new JsonRpcProvider(MAINNET_RPC_URL)
const sepoliaProvider = new JsonRpcProvider(SEPOLIA_RPC_URL)

// Example class for interacting with your "profile" data
class ProfileApiService {
  /**
   * Create a new profile
   */
  async createProfile(metadata: ProfileMetadata, options: Record<string, any>) {
    try {
      // ...some logic with mainnet or sepolia...
      const blockNumber = await mainnetProvider.getBlockNumber()
      console.log('Block number on Mainnet:', blockNumber)

      // Return success/failure structure expected by the rest of your app
      return {
        success: true,
        data: { topics: [], data: '0x...' }, // Ensure this matches the expected structure
      }
    } catch (error) {
      console.error('Error in createProfile:', error)
      return { success: false, data: null }
    }
  }

  /**
   * Update an existing profile
   */
  async updateProfile(profileId: string, data: Record<string, any>, options: Record<string, any>) {
    try {
      // Example usage on Sepolia
      const blockNumber = await sepoliaProvider.getBlockNumber()
      console.log('Block number on Sepolia:', blockNumber)

      // Return success/failure structure
      return {
        success: true,
        data: { hash: 'someTransactionHash' },
      }
    } catch (error) {
      console.error('Error in updateProfile:', error)
      return { success: false, data: null }
    }
  }

  /**
   * Delete a profile
   */
  async deleteProfile(data: Record<string, any>, options: Record<string, any>) {
    try {
      // Example logic for deletion
      return {
        success: true,
        data: 'Profile deleted',
      }
    } catch (error) {
      console.error('Error in deleteProfile:', error)
      return { success: false, data: null }
    }
  }
}

/**
 * High-level "client" for your profile logic,
 * bridging the offline logic and the ProfileApiService.
 */
class ProfileClientService {
  private profileService: ProfileApiService

  constructor() {
    this.profileService = new ProfileApiService()
  }

  async createProfile(metadata: ProfileMetadata) {
    try {
      // Create profile using your ProfileApiService
      const result = await this.profileService.createProfile(metadata, {})

      if (result.success) {
        // decode event data if needed
        const decodedData = decodeProfileEvent(result.data, profileABI)
        console.log('Decoded data:', decodedData)

        // Example usage of toast from Sonner
        toast.success('Profile created successfully!')
      }
      return result
    } catch (error) {
      console.error('Failed to create profile:', error)
      throw error
    }
  }

  async updateProfile(metadata: ProfileMetadata) {
    try {
      // Adjust logic if 'id' is not part of ProfileMetadata
      const profileId = metadata.id || ''
      const result = await this.profileService.updateProfile(profileId, {}, {})
      if (result.success) {
        toast.success('Profile updated successfully!')
      }
      return result
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  }

  async deleteProfile() {
    try {
      const result = await this.profileService.deleteProfile({}, {})
      if (result.success) {
        toast.success('Profile deleted successfully!')
        // Clear cache or do other logic
        await profileCacheService.clearCache()
      }
      return result
    } catch (error) {
      console.error('Failed to delete profile:', error)
      throw error
    }
  }
}

// Export a singleton for usage across your app
export const profileClientService = new ProfileClientService()
