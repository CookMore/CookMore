'use client'

import { BaseEdgeService } from './base'
import type { Profile, ServiceResponse } from '@/types/profile'

class ProfileEdgeService extends BaseEdgeService {
  async getProfile(address: string, options?: any): Promise<ServiceResponse<Profile>> {
    try {
      const cacheKey = `profile:${address}`

      return this.withCache(
        cacheKey,
        async () => {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
          const response = await fetch(`${baseUrl}/api/profile?address=${address}`, {
            headers: this.getHeaders(options),
          })

          if (!response.ok) {
            throw new Error(`Failed to fetch profile: ${response.status}`)
          }

          const result = await response.json()

          if (!result.success) {
            throw new Error(result.error || 'Failed to fetch profile')
          }

          return {
            success: true,
            data: result.data,
          }
        },
        options
      )
    } catch (error) {
      console.error('Profile Edge Service Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
      }
    }
  }

  async updateProfile(address: string, data: any): Promise<ServiceResponse<any>> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const response = await fetch(`${baseUrl}/api/profile/${address}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getHeaders(),
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to update profile')
      }

      // Invalidate cache
      await this.cache.delete(`profile:${address}`)

      return {
        success: true,
        data: result.data,
      }
    } catch (error) {
      console.error('Profile Update Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
      }
    }
  }

  async upgradeProfile(address: string, tier: string): Promise<ServiceResponse<any>> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const response = await fetch(`${baseUrl}/api/profile/${address}/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getHeaders(),
        },
        body: JSON.stringify({ tier }),
      })

      if (!response.ok) {
        throw new Error(`Failed to upgrade profile: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to upgrade profile')
      }

      // Invalidate cache
      await this.cache.delete(`profile:${address}`)

      return {
        success: true,
        data: result.data,
      }
    } catch (error) {
      console.error('Profile Upgrade Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upgrade profile',
      }
    }
  }
}

export const profileEdgeService = new ProfileEdgeService()
