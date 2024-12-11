import { type Address } from 'viem'

// Wallet Types
export type WalletType = 'embedded' | 'coinbase' | 'other'

export interface WalletData {
  address: Address
  type: WalletType
  chainId?: number
}

// Profile Tiers
export enum ProfileTier {
  FREE = 'Free',
  PRO = 'Pro',
  GROUP = 'Group',
}

// Profile Types
export interface UserProfile {
  id: string
  email?: string
  wallet?: WalletData
  tier: ProfileTier
  linkedAccounts?: Array<{
    type: 'email' | 'google' | 'apple' | 'discord' | 'twitter' | 'farcaster'
    id: string
  }>
  created?: Date
  updated?: Date
}

export interface ProfileState {
  isLoading: boolean
  error?: Error
  data?: UserProfile
  tier?: ProfileTier
}

export interface ProfileMetadata {
  profileId?: string
  version?: string
  name: string
  bio?: string
  avatar?: string | File
  location?: string
  website?: string
  culinaryInfo?: {
    specialties?: string[]
    experience?: string
    certifications?: string[]
    gallery?: Array<string | File>
  }
  preferences?: {
    language?: string
    timezone?: string
    notifications?: boolean
  }
  social?: {
    twitter?: string
    discord?: string
    github?: string
    instagram?: string
    linkedin?: string
    farcaster?: string
  }
}

export interface ProfileNFT {
  id: string
  tokenId: string
  owner: Address
  tier: ProfileTier
  metadata: ProfileMetadata
  created: Date
  updated: Date
}

// Service Response Types
export interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface ProfileActionResponse {
  success: boolean
  hash?: string
  error?: string
}

// Form Types
export interface ProfileFormData {
  name: string
  bio?: string
  avatar?: File
  tier: ProfileTier
  metadata: ProfileMetadata
}

// Validation Types
export interface ProfileValidation {
  isValid: boolean
  errors?: Record<string, string>
}

// Event Types
export interface ProfileEvent {
  type: 'create' | 'update' | 'delete' | 'upgrade'
  profileId: string
  data?: any
  timestamp: number
}

// Add to existing exports
export const PROFILE_VERSIONS = ['1.0.0'] as const
export const CURRENT_PROFILE_VERSION = PROFILE_VERSIONS[0]

export type ProfileVersion = (typeof PROFILE_VERSIONS)[number]
