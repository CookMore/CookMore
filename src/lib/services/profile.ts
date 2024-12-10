'use client'

import { profileEdgeService } from '@/lib/edge/services'
import type {
  Profile,
  ProfileMetadata,
  ServiceResponse,
  ProfileActionResponse,
  ProfileTier,
} from '@/types/profile'

export class ProfileService {
  private static edgeService = profileEdgeService

  static async getProfile(address: string): Promise<ServiceResponse<Profile>> {
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
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
      }
    }
  }

  static async updateProfile(
    address: string,
    data: Partial<ProfileMetadata>
  ): Promise<ProfileActionResponse> {
    try {
      const response = await this.edgeService.updateProfile(address, data)
      if (!response.success) {
        throw new Error(response.error || 'Failed to update profile')
      }
      return response
    } catch (error) {
      console.error('Profile Update Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
      }
    }
  }

  static async upgradeProfile(address: string, tier: ProfileTier): Promise<ProfileActionResponse> {
    try {
      const response = await this.edgeService.upgradeProfile(address, tier)
      if (!response.success) {
        throw new Error(response.error || 'Failed to upgrade profile')
      }
      return response
    } catch (error) {
      console.error('Profile Upgrade Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upgrade profile',
      }
    }
  }

  static async verifyProfile(address: string): Promise<boolean> {
    try {
      const response = await this.getProfile(address)
      return response.success && !!response.data
    } catch {
      return false
    }
  }

  static async verifyTier(address: string, tier: ProfileTier): Promise<boolean> {
    try {
      const response = await this.getProfile(address)
      return response.success && response.data?.metadata?.tier === tier
    } catch {
      return false
    }
  }
}

// Export singleton instance and individual methods for convenience
export const profileService = new ProfileService()
export const getProfile = ProfileService.getProfile.bind(ProfileService)
export const updateProfile = ProfileService.updateProfile.bind(ProfileService)
export const upgradeProfile = ProfileService.upgradeProfile.bind(ProfileService)
export const verifyProfile = ProfileService.verifyProfile.bind(ProfileService)
export const verifyTier = ProfileService.verifyTier.bind(ProfileService)
