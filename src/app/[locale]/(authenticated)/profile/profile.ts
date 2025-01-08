// Type for Ethereum addresses
type Address = `0x${string}`

// Version Control
export const PROFILE_VERSIONS = ['1.0', '1.1', '1.2'] as const
export type ProfileVersion = (typeof PROFILE_VERSIONS)[number]
export const CURRENT_PROFILE_VERSION = PROFILE_VERSIONS[PROFILE_VERSIONS.length - 1]

// Profile Tiers
export enum ProfileTier {
  FREE = 0,
  PRO = 1,
  GROUP = 2,
  OG = 3,
}

// Base types used across tiers
export interface SocialLinks {
  urls: string[]
  labels: string[]
}

// Preferences Type
export interface Preferences {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  displayEmail: boolean
  displayLocation: boolean
  email?: string
}

// Base Profile Metadata Interface
export interface BaseProfileMetadata {
  profileId?: string
  version: ProfileVersion
  tier: ProfileTier
  name: string
  bio?: string
  description?: string
  avatar?: string
  image?: string | File
  banner?: string
  location?: string
  social: SocialLinks
  preferences: Preferences
  attributes?: {
    version?: string
    tier?: ProfileTier
    timestamp?: number
    ipfsNotesCID?: string
    [key: string]: any
  }
  culinaryInfo: {
    expertise: 'beginner' | 'intermediate' | 'advanced' | 'professional'
    specialties: string[]
    dietaryPreferences: string[]
    cuisineTypes: string[]
    techniques: string[]
    equipment: string[]
  }
  achievements: {
    recipesCreated: number
    recipesForked: number
    totalLikes: number
    badges: string[]
    featuredIn?: Array<{
      publication: string
      title: string
      date: string
      link?: string
    }>
    competitions?: Array<{
      name: string
      position: string
      date: string
      description?: string
    }>
  }
}

// Free Tier - Basic Profile
export interface FreeProfileMetadata extends BaseProfileMetadata {}

// Pro Tier - Professional Chef Profile
export interface ProProfileMetadata extends BaseProfileMetadata {
  title?: string
  company?: string
  experience: {
    current?: {
      title: string
      company: string
      location?: string
      startDate: string
      description?: string
    }
    history?: Array<{
      title: string
      company: string
      location?: string
      startDate: string
      endDate?: string
      description?: string
    }>
  }
  education?: Array<{
    institution: string
    degree?: string
    field?: string
    startYear: string
    endYear?: string
    location?: string
  }>
  awards?: Array<{
    name: string
    issuer: string
    date: string
    description?: string
    link?: string
  }>
  culinaryInfo: FreeProfileMetadata['culinaryInfo'] & {
    certifications: Array<{
      name: string
      issuer: string
      date: string
      expiryDate?: string
      verificationLink?: string
    }>
    techniques: string[]
    equipment: string[]
  }
  languages?: Array<{
    language: string
    proficiency: 'basic' | 'intermediate' | 'fluent' | 'native'
  }>
  availability?: {
    forHire: boolean
    consulting: boolean
    collaborations: boolean
    teaching: boolean
  }
  businessInfo?: BaseBusinessInfo & {
    rates?: {
      hourly?: string
      daily?: string
      project?: string
    }
  }
}

// Group Tier - Restaurant/Organization Profile
export interface GroupProfileMetadata extends BaseProfileMetadata {
  baseName: string
  organizationInfo: {
    type: 'restaurant' | 'culinary-school' | 'catering' | 'food-service' | 'other'
    establishedYear: string
    size: 'small' | 'medium' | 'large' | 'enterprise'
    branches?: Array<{
      name: string
      location: string
      isHeadquarters: boolean
      contactInfo: {
        phone?: string
        email?: string
        address: string
      }
    }>
    team: Array<{
      role: string
      count: number
      requirements?: string[]
    }>
  }
  facilities?: Array<{
    type: 'kitchen' | 'dining' | 'training' | 'storage' | 'other'
    capacity: number
    features: string[]
    equipment?: string[]
    maintenanceSchedule?: Array<{
      item: string
      lastMaintenance: string
      nextMaintenance: string
      responsible?: string
    }>
  }>
  compliance: {
    certifications: Array<{
      type: string
      issuer: string
      validUntil: string
      verificationLink?: string
    }>
    licenses: Array<{
      type: string
      number: string
      jurisdiction: string
      validUntil: string
    }>
    inspections?: Array<{
      date: string
      authority: string
      rating: string
      report?: string
      nextInspectionDue?: string
      remediationRequired?: boolean
      remediationNotes?: string
    }>
    insurance?: Array<{
      type: string
      provider: string
      policyNumber: string
      coverage: string
      validUntil: string
    }>
  }
  businessOperations: {
    operatingHours: Array<{
      day: string
      hours: string
      type: 'regular' | 'holiday' | 'special'
    }>
    serviceTypes: Array<'dine-in' | 'takeout' | 'delivery' | 'catering' | 'training'>
    capacity: {
      seating?: number
      eventSpace?: number
      trainingCapacity?: number
      maxOccupancy?: number
      privateRooms?: number
    }
    specializations: string[]
    seasonalMenu?: boolean
    cateringMinimum?: number
    deliveryRadius?: number
    reservationPolicy?: string
  }
  marketing?: {
    brandColors?: string[]
    tagline?: string
    mediaKit?: string
    pressReleases?: Array<{
      title: string
      date: string
      link: string
    }>
    socialMedia?: Array<{
      platform: string
      handle: string
      url: string
      followers?: number
    }>
    promotions?: Array<{
      title: string
      description: string
      startDate: string
      endDate: string
      terms?: string
    }>
  }
  businessInfo?: BaseBusinessInfo & {
    taxId?: string
    billingAddress?: string
    paymentMethods?: string[]
    invoicingEmail?: string
  }
  suppliers?: Array<{
    name: string
    type: string[]
    contact: {
      name: string
      email: string
      phone?: string
    }
    terms?: string
    preferredStatus?: boolean
    lastOrderDate?: string
  }>
  certifications?: string[]
}

// OG Extension Interface
interface OGExtension {
  ogBenefits: {
    joinDate: string
    memberNumber: number
    customBranding: {
      primaryColor: string
      secondaryColor: string
    }
    apiAccess: {
      enabled: boolean
      key?: string
      permissions?: string[]
    }
  }
  showcase: {
    featured: boolean
    highlights: Array<{
      title: string
      description: string
      date: string
      media?: string
    }>
    specialAccess: string[]
  }
  network: {
    mentorship: {
      available: boolean
      specialties: string[]
      maxMentees?: number
    }
    collaborations: Array<{
      type: string
      description: string
      status: 'active' | 'completed' | 'planned'
    }>
    events: Array<{
      name: string
      date: string
      type: 'workshop' | 'masterclass' | 'collaboration'
      capacity: number
    }>
  }
  verificationStatus: {
    verified: boolean
    verifiedDate?: string
    verificationLevel: 'basic' | 'advanced' | 'expert'
  }
}

// OG Tier - Special Profile
export interface OGProfileMetadata extends BaseProfileMetadata, OGExtension {}

// The main type that represents all possible profiles
export type ProfileMetadata =
  | FreeProfileMetadata
  | ProProfileMetadata
  | GroupProfileMetadata
  | OGProfileMetadata

// Core Profile Type
export interface Profile {
  id?: string
  tokenId: string | bigint
  owner: string | Address
  metadata: ProfileMetadata
  metadataUri?: string
  ipfsNotesCID?: string
  tier: ProfileTier
  exists?: boolean
  createdAt: number | Date
  updatedAt: number | Date
  eventLog: { topics: string[]; data: string }
}

// Base business info type
interface BaseBusinessInfo {
  businessHours?: string
  services?: string[]
  serviceAreas?: string[]
}

// Form Data Type
export interface ProfileFormData {
  basicInfo: {
    name: string
    bio?: string
    avatar?: string
    banner?: string
    location?: string
    social?: {
      twitter?: string
      website?: string
    }
  }
  socialLinks?: {
    twitter?: string
    instagram?: string
    website?: string
  }
  tier: ProfileTier
  version: ProfileVersion
  culinaryInfo?: {
    expertise: string
    specialties: string[]
    dietaryPreferences: string[]
    cuisineTypes: string[]
    techniques: string[]
    equipment: string[]
  }
  achievements?: {
    recipesCreated: number
    recipesForked: number
    totalLikes: number
    badges: string[]
  }
  businessOperations?: {
    operatingHours: Array<{
      day: string
      hours: string
      type: 'regular' | 'holiday' | 'special'
    }>
    serviceTypes: string[]
    deliveryRadius?: string
    capacity?: {
      seating: number
      eventSpace: number
    }
    seasonalMenu: boolean
    specializations: string[]
  }
  certifications?: string[]
  media?: {
    gallery: string[]
    documents: string[]
  }
}

// Service Response Types
export interface TierStatus {
  hasGroup: boolean
  hasPro: boolean
  hasOG: boolean
  currentTier: ProfileTier
}

export interface ServiceResponse<T = ProfileMetadata> {
  success: boolean
  data?: T | null
  error?: string
  tierStatus: TierStatus
}

export interface ProfileActionResponse extends ServiceResponse {
  tokenId?: string
  tier?: ProfileTier
  ipfsHash?: string
  hash?: string
}

export interface ProfileUpdateResponse extends ServiceResponse {
  previousTier?: ProfileTier
  newTier?: ProfileTier
}

// Form Props Types
interface BaseProfileFormProps<T extends ProfileMetadata = ProfileMetadata> {
  currentSection: number
  initialData?: T
  onSubmit?: (data: T) => Promise<void>
}

export interface FreeProfileFormProps extends BaseProfileFormProps<FreeProfileMetadata> {}
export interface ProProfileFormProps extends BaseProfileFormProps<ProProfileMetadata> {}
export interface GroupProfileFormProps extends BaseProfileFormProps<GroupProfileMetadata> {}
