import { useState, useCallback } from 'react'
import { getTierValidation } from '../../../validations/validation'
import type { ProfileFormData, ProfileTier } from '../../../profile'
import type { OnChainMetadata, IPFSMetadata } from '../../../types/metadata'

interface ValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
}

interface UseProfileValidation {
  isValidating: boolean
  error: string | null
  validateForm: (formData: ProfileFormData, tier: ProfileTier) => Promise<ValidationResult>
  validateMetadata: (
    metadata: OnChainMetadata | IPFSMetadata,
    tier: ProfileTier
  ) => Promise<ValidationResult>
  validateStep: (
    stepId: string,
    formData: Partial<ProfileFormData>,
    tier: ProfileTier
  ) => Promise<ValidationResult>
}

export function useProfileValidation(): UseProfileValidation {
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateForm = useCallback(
    async (formData: ProfileFormData, tier: ProfileTier): Promise<ValidationResult> => {
      setIsValidating(true)
      setError(null)

      try {
        const validationSchema = getTierValidation(tier)
        await validationSchema.parseAsync(formData)

        return {
          isValid: true,
          errors: {},
        }
      } catch (err) {
        if (err instanceof Error) {
          const errors = JSON.parse(err.message)
          return {
            isValid: false,
            errors: Object.fromEntries(
              Object.entries(errors).map(([key, value]) => [
                key,
                Array.isArray(value) ? value : [value as string],
              ])
            ),
          }
        }
        throw err
      } finally {
        setIsValidating(false)
      }
    },
    []
  )

  const validateMetadata = useCallback(
    async (
      metadata: OnChainMetadata | IPFSMetadata,
      tier: ProfileTier
    ): Promise<ValidationResult> => {
      setIsValidating(true)
      setError(null)

      try {
        const validationSchema = getTierValidation(tier)
        await validationSchema.parseAsync(metadata)

        return {
          isValid: true,
          errors: {},
        }
      } catch (err) {
        if (err instanceof Error) {
          const errors = JSON.parse(err.message)
          return {
            isValid: false,
            errors: Object.fromEntries(
              Object.entries(errors).map(([key, value]) => [
                key,
                Array.isArray(value) ? value : [value as string],
              ])
            ),
          }
        }
        throw err
      } finally {
        setIsValidating(false)
      }
    },
    []
  )

  const validateStep = useCallback(
    async (
      stepId: string,
      formData: Partial<ProfileFormData>,
      tier: ProfileTier
    ): Promise<ValidationResult> => {
      setIsValidating(true)
      setError(null)

      try {
        const validationSchema = getTierValidation(tier)
        const stepSchema = validationSchema.pick({ [stepId]: true })
        await stepSchema.parseAsync({ [stepId]: formData[stepId as keyof ProfileFormData] })

        return {
          isValid: true,
          errors: {},
        }
      } catch (err) {
        if (err instanceof Error) {
          const errors = JSON.parse(err.message)
          return {
            isValid: false,
            errors: Object.fromEntries(
              Object.entries(errors).map(([key, value]) => [
                key,
                Array.isArray(value) ? value : [value as string],
              ])
            ),
          }
        }
        throw err
      } finally {
        setIsValidating(false)
      }
    },
    []
  )

  return {
    isValidating,
    error,
    validateForm,
    validateMetadata,
    validateStep,
  }
}
