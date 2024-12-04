// Keep existing profile utils code as is
import type { FreeProfileMetadata, ProProfileMetadata, GroupProfileMetadata } from '@/types/profile'
import { CURRENT_PROFILE_VERSION } from '@/types/profile'

export function createEmptyFreeProfile(): FreeProfileMetadata {
  return {
    name: '',
    bio: '',
    avatarUrl: '',
    socialLinks: [],
    culinaryInfo: {
      expertise: 'beginner',
      specialties: [],
      dietaryPreferences: [],
      cuisineTypes: [],
      techniques: [],
      equipment: [],
    },
  }
}

export function createEmptyProProfile(): ProProfileMetadata {
  return {
    ...createEmptyFreeProfile(),
    // Pro-specific defaults
    title: '',
    company: '',
    experience: {
      current: undefined,
      history: [],
    },
    education: [],
    languages: [],
    availability: {
      forHire: false,
      consulting: false,
      collaborations: false,
      teaching: false,
    },
    businessInfo: {
      services: [],
      rates: {
        hourly: '',
        daily: '',
        project: '',
      },
      serviceAreas: [],
    },
    culinaryInfo: {
      ...createEmptyFreeProfile().culinaryInfo,
      certifications: [],
      techniques: [],
      equipment: [],
    },
    achievements: {
      recipesCreated: 0,
      recipesForked: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      badges: [],
    },
    settings: {
      visibility: 'public',
      notifications: {
        email: true,
        push: true,
        marketing: false,
      },
      theme: 'system',
      language: 'en',
    },
  }
}

export function createEmptyGroupProfile(): GroupProfileMetadata {
  return {
    ...createEmptyProProfile(),
    // Group-specific defaults
    members: [],
    groupName: '',
    groupDescription: '',
    groupPrivacy: 'private',
    organizationInfo: {
      type: 'restaurant',
      establishedYear: new Date().getFullYear().toString(),
      size: 'small',
      team: [],
      branches: [],
      facilities: {
        kitchens: [],
        storageAreas: [],
        diningAreas: [],
      },
    },
    compliance: {
      certifications: [],
      licenses: [],
      inspections: [],
      insurance: [],
    },
    businessOperations: {
      operatingHours: [],
      serviceTypes: [],
      capacity: {},
      specializations: [],
      seasonalMenu: false,
      cateringMinimum: 0,
      deliveryRadius: 0,
      reservationPolicy: '',
    },
    marketing: {
      brandColors: [],
      tagline: '',
      mediaKit: '',
      pressReleases: [],
      socialMedia: [],
      promotions: [],
    },
    suppliers: [],
  }
}
