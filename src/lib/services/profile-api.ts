import { EdgeCache } from '@/lib/cache/edge'
import { defaultAvatarDataUrl } from './avatar'
import type {
  Profile,
  ProfileMetadata,
  ServiceResponse,
  ProfileActionResponse,
  ProfileTier,
  ProfileEvent,
  TransactionResponse,
} from '@/types/profile'

export class ProfileService {
  private cache: EdgeCache

  constructor() {
    this.cache = new EdgeCache()
  }

  // Edge API Methods
  static async getProfile(address: string): Promise<ServiceResponse<Profile>> {
    const cacheKey = `profile:${address}`

    try {
      const cached = await EdgeCache.get(cacheKey)
      if (cached) return cached

      const response = await fetch(`/api/profile?address=${address}`)
      const data = await response.json()

      if (!data.data?.metadata?.avatar) {
        data.data.metadata.avatar = defaultAvatarDataUrl
      }

      await EdgeCache.set(cacheKey, data)
      return data
    } catch (error) {
      console.error('Profile API Error:', error)
      return {
        success: false,
        error: 'Failed to fetch profile',
      }
    }
  }

  static async updateProfile(
    address: string,
    data: Partial<ProfileMetadata>
  ): Promise<ProfileActionResponse> {
    const cacheKey = `profile:${address}`

    try {
      const response = await fetch(`/api/profile/${address}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      await EdgeCache.delete(cacheKey)
      return result
    } catch (error) {
      console.error('Profile Update Error:', error)
      return {
        success: false,
        error: 'Failed to update profile',
      }
    }
  }

  // Upgrade Methods
  static async upgradeProfile(address: string, tier: ProfileTier): Promise<TransactionResponse> {
    const cacheKey = `profile:${address}`

    try {
      const response = await fetch(`/api/profile/${address}/upgrade`, {
        method: 'POST',
        body: JSON.stringify({ tier }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      await EdgeCache.delete(cacheKey)
      return result
    } catch (error) {
      console.error('Profile Upgrade Error:', error)
      throw new Error('Failed to upgrade profile')
    }
  }

  // Verification Methods
  static async verifyProfile(address: string): Promise<boolean> {
    try {
      const profile = await this.getProfile(address)
      return profile.success && !!profile.data
    } catch {
      return false
    }
  }

  static async verifyTier(address: string, tier: ProfileTier): Promise<boolean> {
    try {
      const profile = await this.getProfile(address)
      return profile.success && profile.data?.metadata.tier === tier
    } catch {
      return false
    }
  }

  // Event Handling
  static async handleProfileEvent(event: ProfileEvent): Promise<void> {
    const cacheKey = `profile:${event.owner}`
    await EdgeCache.delete(cacheKey)
  }
}
