import { z } from 'zod'
import { ProfileTier, type ProfileMetadata } from '../profile'
import {
  freeProfileSchema,
  proProfileSchema,
  groupProfileSchema,
  ogProfileSchema,
  ProfileTierEnum,
  type ProfileFormData,
  type ProProfileFormData,
  type GroupProfileFormData,
  type OGProfileFormData,
} from './validation'

// Re-export everything from validation and schemas
export * from './validation'
export * from './schemas'

export function getTierValidation(tier: ProfileTier) {
  switch (tier) {
    case ProfileTier.FREE:
      return freeProfileSchema
    case ProfileTier.PRO:
      return proProfileSchema
    case ProfileTier.GROUP:
      return groupProfileSchema
    case ProfileTier.OG:
      return ogProfileSchema
    default:
      return freeProfileSchema
  }
}

export async function validateProfile(
  metadata: ProfileMetadata,
  tier: ProfileTier
): Promise<{ success: boolean; error?: string }> {
  try {
    const validationSchema = getTierValidation(tier)
    await validationSchema.parseAsync(metadata)
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(', '),
      }
    }
    return {
      success: false,
      error: 'Validation failed',
    }
  }
}
