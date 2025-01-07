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
  profile: ProfileMetadata | null
  hasProfile: boolean
  isLoading: boolean
  error: Error | null
  createProfile: (metadata: ProfileMetadata) => Promise<string>
  updateProfile: (metadata: ProfileMetadata) => Promise<string>
  deleteProfile: () => Promise<void>
  currentTier: ProfileTier
  tiersLoading: boolean
  hasPro: boolean
  hasGroup: boolean
  refreshProfile: () => Promise<void>
  validateMetadata: (metadata: ProfileMetadata) => Promise<boolean>
  clearCache: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

function ProfileProviderInner({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  const {
    profile: edgeProfile,
    isLoading: edgeLoading,
    error: edgeError,
    refreshProfile: refreshEdgeProfile,
    clearProfileCache,
  } = useProfileEdge()

  const hasProfile = !!edgeProfile

  const createProfile = async (metadata: ProfileMetadata) => {
    const result = await profileClientService.createProfile(metadata)
    await refreshEdgeProfile()
    return result.data?.hash
  }

  const updateProfile = async (metadata: ProfileMetadata) => {
    const result = await profileClientService.updateProfile(metadata)
    await refreshEdgeProfile()
    return result.data?.hash
  }

  const deleteProfile = async () => {
    await profileClientService.deleteProfile()
    await refreshEdgeProfile()
  }

  const validateMetadata = async (metadata: ProfileMetadata): Promise<boolean> => {
    const isValid = await profileMetadataService.validateMetadata(metadata)
    return isValid !== null && isValid !== ''
  }

  const clearCache = async () => {
    await clearProfileCache()
    await profileCacheService.clearCache()
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const value: ProfileContextValue = {
    profile: edgeProfile,
    hasProfile,
    isLoading: edgeLoading,
    error: edgeError,
    createProfile,
    updateProfile,
    deleteProfile,
    currentTier: ProfileTier.FREE,
    tiersLoading: edgeLoading,
    hasPro: false,
    hasGroup: false,
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
    <ProfileEdgeProvider address={address!.toLowerCase()}>
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

export type { ProfileContextValue }
