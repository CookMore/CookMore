'use client'

import { ProfileTier } from '../../profile'
import type { ProfileMetadata } from '../../profile'
import { getProfileSchema } from '../../validations/schemas'

export class ProfileMetadataService {
  // Validate metadata against schema
  async validateMetadata(metadata: ProfileMetadata): Promise<string | null> {
    try {
      const schema = getProfileSchema(metadata.tier)
      await schema.parseAsync(metadata)
      return null
    } catch (error) {
      if (error instanceof Error) {
        return error.message
      }
      return 'Invalid profile metadata'
    }
  }

  // Create empty metadata for a tier
  createEmptyMetadata(tier: ProfileTier): ProfileMetadata {
    const schema = getProfileSchema(tier)
    const shape = schema.shape

    // Create empty object based on schema shape
    const metadata: Partial<ProfileMetadata> = {
      tier,
      name: '',
      bio: '',
      avatar: '',
    }

    // Add tier-specific fields
    if (tier === ProfileTier.PRO) {
      metadata.experience = {
        years: 0,
        specialties: [],
        certifications: [],
      }
      metadata.socialLinks = {
        website: '',
        twitter: '',
        instagram: '',
      }
    } else if (tier === ProfileTier.GROUP) {
      metadata.organizationInfo = {
        name: '',
        type: 'restaurant',
        size: 1,
        location: '',
      }
      metadata.compliance = {
        hasHealthPermit: false,
        permitNumber: '',
        lastInspectionDate: '',
      }
      metadata.businessHours = []
    }

    return metadata as ProfileMetadata
  }

  // Merge metadata updates
  mergeMetadata(existing: ProfileMetadata, updates: Partial<ProfileMetadata>): ProfileMetadata {
    return {
      ...existing,
      ...updates,
      // Deep merge for nested objects
      ...(updates.tier === ProfileTier.PRO && {
        experience: {
          ...existing.experience,
          ...updates.experience,
        },
        socialLinks: {
          ...existing.socialLinks,
          ...updates.socialLinks,
        },
      }),
      ...(updates.tier === ProfileTier.GROUP && {
        organizationInfo: {
          ...existing.organizationInfo,
          ...updates.organizationInfo,
        },
        compliance: {
          ...existing.compliance,
          ...updates.compliance,
        },
        businessHours: updates.businessHours || existing.businessHours,
      }),
    }
  }

  // Extract public metadata (for display)
  getPublicMetadata(metadata: ProfileMetadata): Partial<ProfileMetadata> {
    const { tier } = metadata
    const publicData: Partial<ProfileMetadata> = {
      tier,
      name: metadata.name,
      bio: metadata.bio,
      avatar: metadata.avatar,
    }

    if (tier === ProfileTier.PRO) {
      publicData.experience = {
        years: metadata.experience?.years,
        specialties: metadata.experience?.specialties,
      }
      publicData.socialLinks = metadata.socialLinks
    } else if (tier === ProfileTier.GROUP) {
      publicData.organizationInfo = {
        name: metadata.organizationInfo?.name,
        type: metadata.organizationInfo?.type,
        location: metadata.organizationInfo?.location,
      }
      publicData.businessHours = metadata.businessHours
    }

    return publicData
  }
}

// Export singleton instance
export const profileMetadataService = new ProfileMetadataService()
