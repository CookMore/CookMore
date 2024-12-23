import { useState, useCallback } from 'react'
import { useProfileContract } from '../components/hooks/contracts/useProfileContract'
import { useProfileMetadata } from '../components/hooks/core/useProfileMetadata'
import type { ProfileFormData, ProfileTier } from '../profile'

interface ProfileCreationState {
  step: number
  isComplete: boolean
  tokenId?: string
  transactionHash?: string
}

interface UseProfileCreation {
  state: ProfileCreationState
  isLoading: boolean
  error: string | null
  setStep: (step: number) => void
  submitProfile: (formData: ProfileFormData, tier: ProfileTier, avatar?: File) => Promise<void>
  updateProfile: (
    tokenId: string,
    formData: ProfileFormData,
    tier: ProfileTier,
    avatar?: File
  ) => Promise<void>
}

export function useProfileCreation(): UseProfileCreation {
  const [state, setState] = useState<ProfileCreationState>({
    step: 0,
    isComplete: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { createProfile, updateProfile } = useProfileContract()
  const { processFormData } = useProfileMetadata()

  const setStep = useCallback((step: number) => {
    setState((prev) => ({
      ...prev,
      step,
    }))
  }, [])

  const submitProfile = useCallback(
    async (formData: ProfileFormData, tier: ProfileTier, avatar?: File) => {
      setIsLoading(true)
      setError(null)

      try {
        // Validate form data
        const { onChainMetadata, ipfsMetadataCID } = await processFormData(formData, avatar)

        // Create profile on-chain
        const { tokenId, transactionHash } = await createProfile(formData, tier, avatar)

        // Update state
        setState((prev) => ({
          ...prev,
          isComplete: true,
          tokenId,
          transactionHash,
        }))
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create profile'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [createProfile, processFormData]
  )

  const handleUpdateProfile = useCallback(
    async (tokenId: string, formData: ProfileFormData, tier: ProfileTier, avatar?: File) => {
      setIsLoading(true)
      setError(null)

      try {
        // Validate form data
        const { onChainMetadata, ipfsMetadataCID } = await processFormData(formData, avatar)

        // Update profile on-chain
        const { transactionHash } = await updateProfile(tokenId, formData, tier, avatar)

        // Update state
        setState((prev) => ({
          ...prev,
          isComplete: true,
          transactionHash,
        }))
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update profile'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [updateProfile, processFormData]
  )

  return {
    state,
    isLoading,
    error,
    setStep,
    submitProfile,
    updateProfile: handleUpdateProfile,
  }
}
