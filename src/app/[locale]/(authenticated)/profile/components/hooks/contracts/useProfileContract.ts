import { useState, useCallback } from 'react'
import { useContractWrite, useContractRead, useWaitForTransaction } from 'wagmi'
import { useProfileMetadata } from '../core/useProfileMetadata'
import type { ProfileFormData, ProfileTier } from '../../../profile'
import type { OnChainMetadata } from '../../../types/metadata'

// Import ABI and contract addresses from your config
import { PROFILE_REGISTRY_ABI, PROFILE_REGISTRY_ADDRESS } from '../config/contracts'

interface UseProfileContract {
  isLoading: boolean
  error: string | null
  createProfile: (
    formData: ProfileFormData,
    tier: ProfileTier,
    avatar?: File
  ) => Promise<{
    tokenId: string
    transactionHash: string
  }>
  updateProfile: (
    tokenId: string,
    formData: ProfileFormData,
    tier: ProfileTier,
    avatar?: File
  ) => Promise<{
    transactionHash: string
  }>
  getProfile: (tokenId: string) => Promise<{
    metadata: OnChainMetadata
    tier: ProfileTier
  } | null>
}

export function useProfileContract(): UseProfileContract {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { processFormData } = useProfileMetadata()

  // Contract write hooks
  const { writeAsync: createProfileWrite } = useContractWrite({
    address: PROFILE_REGISTRY_ADDRESS,
    abi: PROFILE_REGISTRY_ABI,
    functionName: 'createProfile',
  })

  const { writeAsync: updateProfileWrite } = useContractWrite({
    address: PROFILE_REGISTRY_ADDRESS,
    abi: PROFILE_REGISTRY_ABI,
    functionName: 'updateProfile',
  })

  // Contract read hook
  const { data: profileData, refetch } = useContractRead({
    address: PROFILE_REGISTRY_ADDRESS,
    abi: PROFILE_REGISTRY_ABI,
    functionName: 'getProfile',
  })

  const createProfile = useCallback(
    async (
      formData: ProfileFormData,
      tier: ProfileTier,
      avatar?: File
    ): Promise<{
      tokenId: string
      transactionHash: string
    }> => {
      setIsLoading(true)
      setError(null)

      try {
        // Process form data and upload to IPFS
        const { onChainMetadata, ipfsMetadataCID } = await processFormData(formData, avatar)

        // Create profile transaction
        const tx = await createProfileWrite({
          args: [tier, onChainMetadata.name, onChainMetadata.bio, ipfsMetadataCID],
        })

        // Wait for transaction confirmation
        const receipt = await tx.wait()
        const event = receipt.logs.find((log: any) => log.eventName === 'ProfileCreated')

        if (!event) {
          throw new Error('Profile creation event not found')
        }

        return {
          tokenId: event.args.tokenId.toString(),
          transactionHash: receipt.transactionHash,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create profile'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [createProfileWrite, processFormData]
  )

  const updateProfile = useCallback(
    async (
      tokenId: string,
      formData: ProfileFormData,
      tier: ProfileTier,
      avatar?: File
    ): Promise<{
      transactionHash: string
    }> => {
      setIsLoading(true)
      setError(null)

      try {
        // Process form data and upload to IPFS
        const { onChainMetadata, ipfsMetadataCID } = await processFormData(formData, avatar)

        // Update profile transaction
        const tx = await updateProfileWrite({
          args: [tokenId, tier, onChainMetadata.name, onChainMetadata.bio, ipfsMetadataCID],
        })

        // Wait for transaction confirmation
        const receipt = await tx.wait()

        return {
          transactionHash: receipt.transactionHash,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update profile'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [updateProfileWrite, processFormData]
  )

  const getProfile = useCallback(
    async (
      tokenId: string
    ): Promise<{
      metadata: OnChainMetadata
      tier: ProfileTier
    } | null> => {
      try {
        const result = await refetch({
          args: [tokenId],
        })

        if (!result.data) {
          return null
        }

        const [metadata, tier] = result.data
        return {
          metadata,
          tier,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch profile'
        setError(message)
        throw err
      }
    },
    [refetch]
  )

  return {
    isLoading,
    error,
    createProfile,
    updateProfile,
    getProfile,
  }
}
