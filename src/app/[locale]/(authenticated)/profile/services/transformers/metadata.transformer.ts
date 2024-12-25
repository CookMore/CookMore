import type { ProfileFormData } from '../../profile'
import type { OnChainMetadata, IPFSMetadata, ExtendedProfileData } from '../../types/metadata'

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
    // Core metadata for on-chain storage
    const onChainMetadata: OnChainMetadata = {
      name: formData.basicInfo.name,
      bio: formData.basicInfo.bio || '',
      avatar: avatarCID || '',
      ipfsNotesCID: '', // Will be set after IPFS upload
    }

    // Extended data for IPFS storage
    const extendedData: ExtendedProfileData = {
      version: '1.0',
      lastUpdated: new Date().toISOString(),

      // Basic Info
      location: formData.basicInfo.location,
      website: formData.basicInfo.website,

      // Business Operations
      businessOperations: formData.businessOperations
        ? {
            operatingHours: formData.businessOperations.operatingHours || [],
            serviceTypes: formData.businessOperations.serviceTypes || [],
            deliveryRadius: formData.businessOperations.deliveryRadius,
            capacity: formData.businessOperations.capacity,
            seasonalMenu: formData.businessOperations.seasonalMenu || false,
          }
        : undefined,

      // Certifications
      certifications: formData.certifications?.map((cert) => ({
        name: cert.name,
        institution: cert.institution,
        dateReceived: cert.dateReceived,
        expiryDate: cert.expiryDate,
        verificationHash: cert.verificationHash,
      })),

      // Social Links
      social: {
        twitter: formData.socialLinks?.twitter,
        instagram: formData.socialLinks?.instagram,
        website: formData.socialLinks?.website,
      },

      // Additional Media
      media: {
        gallery: formData.media?.gallery || [],
        documents: formData.media?.documents || [],
      },
    }

    // Complete IPFS metadata structure
    const ipfsMetadata: IPFSMetadata = {
      schema: 'https://cookmore.xyz/schemas/profile/v1',
      name: formData.basicInfo.name,
      description: formData.basicInfo.bio || '',
      image: avatarCID || '',
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
}
