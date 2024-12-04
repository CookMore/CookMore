import type { ProfileMetadata, ProfileTier } from '@/types/profile'

const PINATA_API_URL = 'https://api.pinata.cloud'
const PINATA_GATEWAY = 'https://gateway.pinata.cloud'

class IPFSService {
  private headers = {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
  }

  async uploadProfileMetadata(
    metadata: ProfileMetadata & { tier: ProfileTier },
    tier: ProfileTier
  ) {
    try {
      // Prepare metadata for IPFS
      const ipfsMetadata = {
        name: metadata.name,
        description: metadata.bio,
        image: metadata.avatar,
        version: metadata.version,
        banner: metadata.banner,
        location: metadata.location,
        social: metadata.social,
        preferences: metadata.preferences,
        culinaryInfo: metadata.culinaryInfo,
        achievements: metadata.achievements,
        ...(metadata.experience && { experience: metadata.experience }),
        ...(metadata.organizationInfo && { organizationInfo: metadata.organizationInfo }),
        tier,
      }

      // Upload metadata to Pinata
      const formData = new FormData()
      formData.append(
        'file',
        new Blob([JSON.stringify(ipfsMetadata)], { type: 'application/json' })
      )
      formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }))
      formData.append('pinataMetadata', JSON.stringify({ name: `${metadata.name}-profile` }))

      const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: this.headers,
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Failed to upload metadata: ${response.statusText}`)
      }

      const { IpfsHash } = await response.json()
      return `ipfs://${IpfsHash}`
    } catch (error) {
      console.error('IPFS upload error:', error)
      throw error
    }
  }

  async uploadProfileImage(file: File): Promise<string> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }))
      formData.append('pinataMetadata', JSON.stringify({ name: file.name }))

      const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: this.headers,
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`)
      }

      const { IpfsHash } = await response.json()
      return `ipfs://${IpfsHash}`
    } catch (error) {
      console.error('Profile image upload error:', error)
      throw error
    }
  }

  getIPFSUrl(ipfsUrl: string): string {
    const hash = ipfsUrl.replace('ipfs://', '')
    return `${PINATA_GATEWAY}/ipfs/${hash}`
  }
}

export const ipfsService = new IPFSService()
