import type { ProfileFormData } from '../../profile'
import type { OnChainMetadata, IPFSMetadata, ExtendedProfileData } from '../../types/metadata'

interface NFTMetadata extends IPFSMetadata {
  animation_url?: string
  properties: {
    static_render: string
    dynamic_render: string
    profile_data: ExtendedProfileData
    tier_info: {
      tier: string
      tier_level: number
      mint_date: string
    }
  }
}

export class MetadataTransformer {
  /**
   * Transform form data into separate on-chain and IPFS metadata
   */
  static async transformFormData(
    formData: ProfileFormData,
    avatarCID?: string
  ): Promise<{
    onChainMetadata: OnChainMetadata
    ipfsMetadata: IPFSMetadata
  }> {
    // Validate required fields
    if (!formData.basicInfo?.name) {
      throw new Error('Profile name is required')
    }

    // Add debug logging
    console.log('Transforming form data:', {
      formData,
      basicInfo: formData.basicInfo,
      hasName: !!formData.basicInfo?.name,
    })

    // Core metadata for on-chain storage
    const onChainMetadata: OnChainMetadata = {
      name: formData.basicInfo.name,
      bio: formData.basicInfo?.bio || '',
      avatar: avatarCID || '',
      ipfsNotesCID: '', // Will be set after IPFS upload
    }

    // Ensure single ipfs:// prefix
    const formatIpfsUrl = (cid: string) => `ipfs://${cid.replace(/^ipfs:\/\//, '')}`

    // Extended data for IPFS storage
    const extendedData: ExtendedProfileData = {
      version: '1.0',
      lastUpdated: new Date().toISOString(),

      // Basic Info
      location: formData.basicInfo.location,
      website: formData.basicInfo.social?.website,

      // Culinary Info
      culinaryInfo: formData.culinaryInfo,

      // Achievements
      achievements: formData.achievements,

      // Social Links
      social: formData.socialLinks || {},
    }

    // Complete IPFS metadata structure
    const ipfsMetadata: IPFSMetadata = {
      schema: 'https://cookmore.xyz/schemas/profile/v1',
      name: formData.basicInfo.name,
      description: formData.basicInfo.bio || '',
      image: formatIpfsUrl(avatarCID || ''),
      attributes: extendedData,
    }

    return {
      onChainMetadata,
      ipfsMetadata,
    }
  }

  /**
   * Transform IPFS metadata back to form data format
   */
  static transformIPFSToFormData(
    ipfsMetadata: IPFSMetadata,
    onChainMetadata: OnChainMetadata
  ): Partial<ProfileFormData> {
    const { attributes } = ipfsMetadata

    return {
      basicInfo: {
        name: onChainMetadata.name,
        bio: onChainMetadata.bio,
        location: attributes.location,
        website: attributes.website,
      },

      businessOperations: attributes.businessOperations,
      certifications: attributes.certifications,

      socialLinks: {
        twitter: attributes.social?.twitter,
        instagram: attributes.social?.instagram,
        website: attributes.social?.website,
      },

      media: {
        gallery: attributes.media?.gallery || [],
        documents: attributes.media?.documents || [],
      },
    }
  }

  /**
   * Validate metadata structure before upload
   */
  static validateMetadata(metadata: IPFSMetadata | OnChainMetadata): {
    valid: boolean
    errors?: string[]
  } {
    const errors: string[] = []

    if ('schema' in metadata) {
      // Validate IPFS metadata
      if (!metadata.name) errors.push('Name is required')
      if (!metadata.schema) errors.push('Schema is required')
      if (!metadata.attributes) errors.push('Attributes are required')
    } else {
      // Validate on-chain metadata
      if (!metadata.name) errors.push('Name is required')
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    }
  }

  static async transformToNFTMetadata(
    formData: ProfileFormData,
    staticImageCID: string,
    dynamicRendererCID: string,
    tier: string
  ): Promise<NFTMetadata> {
    try {
      const { onChainMetadata, ipfsMetadata } = await this.transformFormData(
        formData,
        staticImageCID
      )

      // Ensure single ipfs:// prefix
      const formatIpfsUrl = (cid: string) => `ipfs://${cid.replace(/^ipfs:\/\//, '')}`

      return {
        ...ipfsMetadata,
        name: `${formData.basicInfo.name}'s Chef Profile`,
        description: formData.basicInfo.bio || '',
        image: formatIpfsUrl(staticImageCID),
        animation_url: formatIpfsUrl(dynamicRendererCID),
        attributes: [
          { trait_type: 'Tier', value: tier },
          { trait_type: 'Name', value: formData.basicInfo.name },
          { trait_type: 'Specialty', value: formData.culinaryInfo?.expertise || 'Beginner' },
          // Add other relevant attributes
        ],
        properties: {
          static_render: formatIpfsUrl(staticImageCID),
          dynamic_render: formatIpfsUrl(dynamicRendererCID),
          profile_data: ipfsMetadata.attributes,
          tier_info: {
            tier,
            tier_level: this.getTierLevel(tier),
            mint_date: new Date().toISOString(),
          },
        },
      }
    } catch (error) {
      console.error('Error transforming NFT metadata:', {
        error,
        formData,
        hasBasicInfo: !!formData.basicInfo,
      })
      throw error
    }
  }

  private static getTierLevel(tier: string): number {
    switch (tier.toLowerCase()) {
      case 'free':
        return 0
      case 'pro':
        return 1
      case 'group':
        return 2
      case 'og':
        return 3
      default:
        return 0
    }
  }
}
