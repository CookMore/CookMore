'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useProfileEdge } from './edge/ProfileEdgeProvider'
import { profileClientService } from '../services/client/profile.service'
import { profileMetadataService } from '../services/client/metadata.service'
import { profileCacheService } from '../services/offline/profile-cache.service'
import type { Profile, ProfileMetadata } from '../profile'
import { ProfileTier } from '../profile'
import { ProfileEdgeProvider } from './edge/ProfileEdgeProvider'

interface ProfileContextValue {
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

  // Utility functions
  refreshProfile: () => Promise<void>
  validateMetadata: (metadata: ProfileMetadata) => Promise<boolean>
  clearCache: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

function ProfileProviderInner({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Get profile data from edge provider
  const {
    profile: edgeProfile,
    isLoading: edgeLoading,
    error: edgeError,
    refreshProfile: refreshEdgeProfile,
    clearProfileCache,
  } = useProfileEdge()

  const hasProfile = !!edgeProfile?.data

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
    return profileMetadataService.validateMetadata(metadata)
  }

  // Cache management
  const clearCache = async () => {
    await clearProfileCache()
    await profileCacheService.clearCache()
  }

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted
  if (!mounted) return null

  const value: ProfileContextValue = {
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
    refreshProfile: refreshEdgeProfile,
    validateMetadata,
    clearCache,
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount()

  if (!isConnected) {
    return children
  }

  return (
    <ProfileEdgeProvider address={address}>
      <ProfileProviderInner>{children}</ProfileProviderInner>
    </ProfileEdgeProvider>
  )
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

// Re-export types
export type { ProfileContextValue }
