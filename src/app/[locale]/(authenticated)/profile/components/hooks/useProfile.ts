'use client'

import { useProfileEdge } from '../../providers/edge/ProfileEdgeProvider'
import { profileClientService } from '../../services/client/profile.service'
import { profileMetadataService } from '../../services/client/metadata.service'
import { profileCacheService } from '../../services/offline/profile-cache.service'
import type { Profile, ProfileMetadata } from '../../profile'
import { ProfileTier } from '../../profile'
import { usePathname } from 'next/navigation'

export interface UseProfileResult {
  // Profile data
  profile: Profile | null
  hasProfile: boolean
  isLoading: boolean
  error: Error | null

  // Profile operations
  createProfile: (metadata: ProfileMetadata) => Promise<string>
  updateProfile: (metadata: ProfileMetadata) => Promise<string>
  deleteProfile: () => Promise<void>

  // Tier information
  currentTier: ProfileTier
  tiersLoading: boolean
  hasPro: boolean
  hasGroup: boolean
  hasOG: boolean

  // Utility functions
  refreshProfile: () => Promise<void>
  validateMetadata: (metadata: ProfileMetadata) => Promise<boolean>
  clearCache: () => Promise<void>
}

export function useProfile(address?: string): UseProfileResult {
  const pathname = usePathname()
  const isCreatingProfile = pathname?.includes('/profile/create')

  // If we're creating a profile, provide a minimal implementation
  if (isCreatingProfile) {
    return {
      profile: null,
      hasProfile: false,
      isLoading: false,
      error: null,
      createProfile: async (metadata: ProfileMetadata) => {
        const result = await profileClientService.createProfile(metadata)
        return result.hash
      },
      updateProfile: async () => '',
      deleteProfile: async () => {},
      currentTier: ProfileTier.FREE,
      tiersLoading: false,
      hasPro: false,
      hasGroup: false,
      hasOG: false,
      refreshProfile: async () => {},
      validateMetadata: async (metadata: ProfileMetadata) => {
        const result = await profileMetadataService.validateMetadata(metadata)
        return result !== null && result !== undefined
      },
      clearCache: async () => {
        await profileCacheService.clearCache()
      },
    }
  }

  const {
    profile: edgeProfile,
    isLoading: edgeLoading,
    error: edgeError,
    refreshProfile: refreshEdgeProfile,
    clearProfileCache,
  } = useProfileEdge()

  const hasProfile = !!edgeProfile

  // Profile operations using client service
  const createProfile = async (metadata: ProfileMetadata) => {
    const result = await profileClientService.createProfile(metadata)
    await refreshEdgeProfile()
    return result.hash
  }

  const updateProfile = async (metadata: ProfileMetadata) => {
    const result = await profileClientService.updateProfile(metadata)
    await refreshEdgeProfile()
    return result.hash
  }

  const deleteProfile = async () => {
    await profileClientService.deleteProfile()
    await refreshEdgeProfile()
  }

  // Metadata validation
  const validateMetadata = async (metadata: ProfileMetadata) => {
    const result = await profileMetadataService.validateMetadata(metadata)
    return result !== null && result !== undefined
  }

  // Cache management
  const clearCache = async () => {
    await clearProfileCache()
    await profileCacheService.clearCache()
  }

  return {
    profile: edgeProfile?.data || null,
    hasProfile,
    isLoading: edgeLoading,
    error: edgeError,
    createProfile,
    updateProfile,
    deleteProfile,
    currentTier: edgeProfile?.tierStatus?.currentTier || ProfileTier.FREE,
    tiersLoading: edgeLoading,
    hasPro: edgeProfile?.tierStatus?.hasPro || false,
    hasGroup: edgeProfile?.tierStatus?.hasGroup || false,
    hasOG: edgeProfile?.tierStatus?.hasOG || false,
    refreshProfile: refreshEdgeProfile,
    validateMetadata,
    clearCache,
  }
}
