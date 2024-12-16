'use client'

import type { ProfileMetadata, ProfileTier } from '@/app/api/types/profile'
import { ipfsService, type IpfsGateway } from '@/app/api/services/ipfs-service'

class ProfileIpfsService {
  private defaultGateway: IpfsGateway = 'gateway.pinata.cloud'

  async uploadProfileMetadata(metadata: ProfileMetadata, tier: ProfileTier): Promise<string> {
    try {
      const { cid } = await ipfsService.uploadJson({ metadata, tier })
      return cid
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      throw new Error('Failed to upload metadata to IPFS')
    }
  }

  async getProfileMetadata(uri: string): Promise<ProfileMetadata | null> {
    try {
      const url = ipfsService.getHttpUrl(uri, this.defaultGateway)
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data as ProfileMetadata
    } catch (error) {
      console.error('Error fetching profile metadata:', error)
      return null
    }
  }

  getUrl(cid: string, gateway?: IpfsGateway): string {
    return ipfsService.getHttpUrl(cid, gateway || this.defaultGateway)
  }

  setDefaultGateway(gateway: IpfsGateway): void {
    this.defaultGateway = gateway
  }
}

// Export singleton instance
export const profileIpfsService = new ProfileIpfsService()
