'use client'

import { ProfileTier } from '../../profile'
import type { ProfileMetadata, OGExtension } from '../../profile'
import { CURRENT_PROFILE_VERSION } from '../../profile'
import { getProfileSchema } from '../../validations/validation'

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
    // Base metadata fields for all tiers
    const baseMetadata = {
      version: CURRENT_PROFILE_VERSION,
      tier,
      name: '',
      bio: '',
      avatar: '',
      social: { urls: [], labels: [] },
      preferences: {
        theme: 'system' as const,
        notifications: true,
        displayEmail: false,
        displayLocation: false,
      },
      culinaryInfo: {
        expertise: 'beginner' as const,
        specialties: [],
        dietaryPreferences: [],
        cuisineTypes: [],
        techniques: [],
        equipment: [],
      },
      achievements: {
        recipesCreated: 0,
        recipesForked: 0,
        totalLikes: 0,
        badges: [],
      },
    }

    if (tier === ProfileTier.FREE) {
      return baseMetadata as FreeProfileMetadata
    }

    if (tier === ProfileTier.PRO) {
      return {
        ...baseMetadata,
        experience: {
          current: {
            title: '',
            company: '',
            startDate: '',
          },
          history: [],
        },
        education: [],
        culinaryInfo: {
          ...baseMetadata.culinaryInfo,
          certifications: [],
        },
      } as ProProfileMetadata
    }

    if (tier === ProfileTier.GROUP) {
      return {
        ...baseMetadata,
        baseName: '',
        organizationInfo: {
          type: 'restaurant',
          establishedYear: new Date().getFullYear().toString(),
          size: 'small',
          team: [],
        },
        compliance: {
          certifications: [],
          licenses: [],
        },
        businessOperations: {
          operatingHours: [],
          serviceTypes: [],
          specializations: [],
        },
      } as GroupProfileMetadata
    }

    if (tier === ProfileTier.OG) {
      return {
        ...baseMetadata,
        baseName: '',
        organizationInfo: {
          type: 'restaurant',
          establishedYear: new Date().getFullYear().toString(),
          size: 'small',
          team: [],
        },
        compliance: {
          certifications: [],
          licenses: [],
        },
        businessOperations: {
          operatingHours: [],
          serviceTypes: [],
          specializations: [],
        },
        ogBenefits: {
          joinDate: new Date().toISOString(),
          memberNumber: 0,
          customBranding: {
            primaryColor: '#000000',
            secondaryColor: '#ffffff',
          },
          apiAccess: {
            enabled: false,
          },
        },
        showcase: {
          featured: false,
          highlights: [],
          specialAccess: [],
        },
        network: {
          mentorship: {
            available: false,
            specialties: [],
          },
          collaborations: [],
          events: [],
        },
        verificationStatus: {
          verified: false,
          verificationLevel: 'basic',
        },
      } as GroupProfileMetadata & OGExtension
    }

    return baseMetadata as FreeProfileMetadata
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
