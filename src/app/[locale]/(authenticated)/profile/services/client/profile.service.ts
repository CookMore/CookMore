'use client'

import { ProfileApiService } from '@/app/api/edge'
import { profileCacheService } from '@/app/[locale]/(authenticated)/profile/services/offline/profile-cache.service'
import type { ProfileMetadata } from '@/app/[locale]/(authenticated)/profile/profile'
import { decodeProfileEvent } from '@/app/api/blockchain/utils/eventDecoder'

class ProfileClientService {
  private profileService: ProfileApiService

  constructor() {
    this.profileService = new ProfileApiService()
  }

  async createProfile(metadata: ProfileMetadata) {
    try {
      // Try to create profile online
      const result = await this.profileService.createProfile(metadata, {})

      // Cache the result
      if (result.success) {
        // Decode the event data
        const decodedData = decodeProfileEvent(result.data)

        // Log the decoded data to inspect its structure
        console.log('Decoded Data:', decodedData)

        // Check if decodedData is not null before using it
        if (decodedData) {
          // Cache the decoded data if necessary
          await profileCacheService.cacheMetadata(decodedData.correctProperty, metadata)
        }
      }

      return result
    } catch (error) {
      // Handle offline case
      console.error('Failed to create profile:', error)
      throw error
    }
  }

  async updateProfile(metadata: ProfileMetadata) {
    try {
      // Try to update profile online
      const profileId = metadata.id // Ensure 'id' is a string field in ProfileMetadata
      const result = await this.profileService.updateProfile(profileId, {}, {})

      // Cache the result
      if (result.success) {
        await profileCacheService.cacheMetadata(result.data.hash, metadata)
      }

      return result
    } catch (error) {
      // Handle offline case
      console.error('Failed to update profile:', error)
      throw error
    }
  }

  async deleteProfile() {
    try {
      // Try to delete profile online
      const result = await this.profileService.deleteProfile({}, {})

      // Clear cache if successful
      if (result.success) {
        await profileCacheService.clearCache()
      }

      return result
    } catch (error) {
      // Handle offline case
      console.error('Failed to delete profile:', error)
      throw error
    }
  }
}
export const profileClientService = new ProfileClientService()
