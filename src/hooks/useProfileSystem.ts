'use client'

import { useCallback, useState } from 'react'
import { useProfileRegistry } from './useProfileRegistry'
import { useMetadataContract } from './useMetadataContract'
import { useAccessControl } from './useAccessControl'
import { useNFTTiers } from './useNFTTiers'
import { usePrivy } from '@privy-io/react-auth'
import { ProfileTier } from '@/types/profile'
import type { ProfileMetadata } from '@/types/profile'

// Admin address
const ADMIN_ADDRESS = '0x1920F5b512634DE346100b025382c04eEA8Bbc67'

export function useProfileSystem() {
  const { createProfile, updateProfile } = useProfileRegistry()
  const { createMetadata, updateMetadata } = useMetadataContract()
  const { canManageProfiles, grantRole, ROLES, hasRole } = useAccessControl()
  const { hasPro, hasGroup } = useNFTTiers()
  const { user } = usePrivy()
  const [isLoading, setIsLoading] = useState(false)

  const handleProfileSubmit = useCallback(
    async (data: ProfileMetadata & { tier: ProfileTier }, tier: ProfileTier) => {
      setIsLoading(true)
      try {
        // Special handling for admin
        if (user?.wallet?.address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
          // Admin can always create profiles
          const profileTx = await createProfile(data, tier)
          await createMetadata(Number(profileTx), data)
          return profileTx
        }

        // For non-admin users, check permissions
        const hasPermission = await canManageProfiles()
        if (!hasPermission && user?.wallet?.address) {
          // Only admin can grant roles
          const isAdmin = await hasRole(ROLES.ADMIN, user.wallet.address)
          if (!isAdmin) {
            throw new Error('You do not have permission to manage profiles')
          }
          await grantRole(ROLES.PROFILE_MANAGER, user.wallet.address)
        }

        // Create profile
        const profileTx = await createProfile(data, tier)
        await createMetadata(Number(profileTx), data)
        return profileTx
      } catch (error) {
        console.error('Profile submission error:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [
      createProfile,
      createMetadata,
      canManageProfiles,
      grantRole,
      hasRole,
      user?.wallet?.address,
      hasPro,
      hasGroup,
    ]
  )

  const handleProfileUpdate = useCallback(
    async (profileId: number, data: ProfileMetadata & { tier: ProfileTier }, tier: ProfileTier) => {
      setIsLoading(true)
      try {
        // Special handling for admin
        if (user?.wallet?.address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
          // Admin can always update profiles
          await Promise.all([updateProfile(data, tier), updateMetadata(profileId, data)])
          return
        }

        // For non-admin users, check permissions
        const hasPermission = await canManageProfiles()
        if (!hasPermission) {
          throw new Error('You do not have permission to manage profiles')
        }

        // Update profile
        await Promise.all([updateProfile(data, tier), updateMetadata(profileId, data)])
      } catch (error) {
        console.error('Profile update error:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [updateProfile, updateMetadata, canManageProfiles, user?.wallet?.address]
  )

  return {
    handleProfileSubmit,
    handleProfileUpdate,
    hasPro,
    hasGroup,
    isLoading,
  }
}
