'use client'

import { useCallback } from 'react'
import { useAccount, useContractRead, useContractWrite, readContract } from 'wagmi'
import { PROFILE_REGISTRY_CONFIG, METADATA_CONFIG } from './config'
import { type ProfileHookResult } from './types'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { ProfileTier } from '@/app/api/types/profile'

export function useProfileContract(): ProfileHookResult {
  const t = useTranslations('profile')
  const { address } = useAccount()

  // Profile Registry Read Operations
  const { data: hasProfile = false, isLoading: readLoading } = useContractRead({
    ...PROFILE_REGISTRY_CONFIG,
    functionName: 'hasProfile',
    args: [address],
    enabled: !!address,
  })

  // Profile Registry Write Operations
  const { writeAsync: createProfileWrite, isLoading: createLoading } = useContractWrite({
    ...PROFILE_REGISTRY_CONFIG,
    functionName: 'createProfile',
  })

  const { writeAsync: updateProfileWrite, isLoading: updateLoading } = useContractWrite({
    ...PROFILE_REGISTRY_CONFIG,
    functionName: 'updateProfile',
  })

  // Metadata Contract Operations
  const { writeAsync: createMetadataWrite } = useContractWrite({
    ...METADATA_CONFIG,
    functionName: 'createMetadata',
  })

  const { writeAsync: updateMetadataWrite } = useContractWrite({
    ...METADATA_CONFIG,
    functionName: 'updateMetadata',
  })

  // Combined Operations
  const createProfile = useCallback(
    async (metadataURI: string, tier: ProfileTier) => {
      try {
        const metadataId = await createMetadataWrite({ args: [metadataURI] })
        const tx = await createProfileWrite({ args: [metadataURI, metadataId, tier] })
        return tx.hash
      } catch (error) {
        console.error('Error creating profile:', error)
        throw error
      }
    },
    [createMetadataWrite, createProfileWrite]
  )

  const updateProfile = useCallback(
    async (metadataURI: string, profileId: number) => {
      try {
        await updateMetadataWrite({ args: [profileId, metadataURI] })
        const tx = await updateProfileWrite({ args: [metadataURI] })
        return tx.hash
      } catch (error) {
        console.error('Error updating profile:', error)
        throw error
      }
    },
    [updateMetadataWrite, updateProfileWrite]
  )

  const getProfile = useCallback(async (profileId: string) => {
    try {
      const data = await readContract({
        ...PROFILE_REGISTRY_CONFIG,
        functionName: 'getProfile',
        args: [profileId],
      })
      return data
    } catch (error) {
      console.error('Error reading profile:', error)
      throw error
    }
  }, [])

  return {
    createProfile,
    updateProfile,
    getProfile,
    hasProfile,
    isLoading: readLoading || createLoading || updateLoading,
  }
}
