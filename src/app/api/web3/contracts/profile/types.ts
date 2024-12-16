'use client'

import { type Address } from 'viem'
import { ProfileTier } from '@/app/api/types/profile'

export interface ProfileRegistryContract {
  address: Address
  abi: typeof import('./abi').PROFILE_REGISTRY_ABI
}

export interface ProfileHookResult {
  createProfile: (metadata: any, tier: ProfileTier) => Promise<string>
  updateProfile: (metadata: any, tier: ProfileTier) => Promise<string>
  getProfile: (address: string) => Promise<any>
  hasProfile: (address: string) => Promise<boolean>
  isLoading: boolean
}
