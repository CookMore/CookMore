'use client'

import { profileEdgeService } from '@/app/api/edge'
import { profileCacheService } from '@/app/[locale]/(authenticated)/profile/services/offline/profile-cache.service'
import type { ProfileMetadata } from '@/app/[locale]/(authenticated)/profile/profile'

class ProfileClientService {
  async createProfile(metadata: ProfileMetadata) {
    try {
      // Try to create profile online
      const result = await profileEdgeService.createProfile(metadata)

      // Cache the result
      if (result.success) {
        await profileCacheService.cacheMetadata(result.address, metadata)
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
      const result = await profileEdgeService.updateProfile(metadata)

      // Cache the result
      if (result.success) {
        await profileCacheService.cacheMetadata(result.address, metadata)
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
      const result = await profileEdgeService.deleteProfile()

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
