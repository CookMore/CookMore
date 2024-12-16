'use client'

import {
  BaseEdgeService,
  type EdgeServiceConfig,
  type ServiceResponse,
} from '@/app/api/edge/services/base'
import type { Profile } from '@/app/api/types/profile'

export interface ProfileApiConfig extends EdgeServiceConfig {
  apiEndpoint?: string
}

export class ProfileApiService extends BaseEdgeService {
  constructor(config: ProfileApiConfig = {}) {
    super({
      ...config,
      baseUrl: config.apiEndpoint || '/api/profile',
    })
  }

  async getProfile(address: string): Promise<ServiceResponse<Profile>> {
    try {
      const response = await fetch(`${this.config.baseUrl}/${address}`, {
        headers: this.getHeaders(),
      })
      return this.handleResponse<Profile>(response)
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
      }
    }
  }

  async updateProfile(address: string, data: Partial<Profile>): Promise<ServiceResponse<Profile>> {
    try {
      const response = await fetch(`${this.config.baseUrl}/${address}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return this.handleResponse<Profile>(response)
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to update profile',
      }
    }
  }

  async createProfile(data: Profile): Promise<ServiceResponse<Profile>> {
    try {
      const response = await fetch(this.config.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return this.handleResponse<Profile>(response)
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to create profile',
      }
    }
  }
}

// Export singleton instance
export const profileApi = new ProfileApiService()
