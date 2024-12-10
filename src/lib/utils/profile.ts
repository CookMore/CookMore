import type { FreeProfileMetadata, ProProfileMetadata, GroupProfileMetadata } from '@/types/profile'
import { CURRENT_PROFILE_VERSION, ProfileTier } from '@/types/profile'

export function createEmptyFreeProfile(): FreeProfileMetadata {
  return {
    version: CURRENT_PROFILE_VERSION,
    tier: ProfileTier.FREE,
    basicInfo: {
      name: '',
      bio: '',
      avatar: '',
      banner: '',
      location: '',
      website: '',
    },
    education: [],
    culinaryInfo: {
      expertise: 'beginner',
      specialties: [],
      dietaryPreferences: [],
      cuisineTypes: [],
      techniques: [],
      equipment: [],
      certifications: [],
    },
    socialLinks: {
      twitter: '',
      instagram: '',
      facebook: '',
      linkedin: '',
      youtube: '',
    },
  }
}

export function createEmptyProProfile(): ProProfileMetadata {
  return {
    ...createEmptyFreeProfile(),
    tier: ProfileTier.PRO,
    title: '',
    company: '',
    experience: {
      current: {
        title: '',
        company: '',
        startDate: '',
      },
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
    certifications: [],
    marketing: {
      brandColors: [],
      tagline: '',
      mediaKit: '',
      pressReleases: [],
      socialMedia: [],
      promotions: [],
    },
  }
}

export function createEmptyGroupProfile(): GroupProfileMetadata {
  return {
    ...createEmptyProProfile(),
    tier: ProfileTier.GROUP,
    organizationInfo: {
      name: '',
      type: 'restaurant',
      size: 'small',
      establishedYear: new Date().getFullYear().toString(),
      team: [],
      branches: [],
    },
    businessOperations: {
      operatingHours: [],
      serviceTypes: [],
      capacity: {
        seating: 0,
        eventSpace: 0,
        trainingCapacity: 0,
        maxOccupancy: 0,
      },
      services: [],
    },
    team: {
      size: 0,
      roles: [],
      structure: '',
    },
    suppliers: [],
    compliance: {
      certifications: [],
      licenses: [],
      insurance: [],
    },
  }
}
