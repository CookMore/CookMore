import { z } from 'zod'
import type { ProfileMetadata, ProfileTier } from '@/types/profile'

export const profileSchema = z
  .object({
    name: z.string().min(2).max(50),
    bio: z.string().min(10).max(500),
    avatar: z.string().min(1),

    experience: z
      .object({
        current: z
          .object({
            title: z.string(),
            company: z.string(),
            location: z.string().optional(),
            startDate: z.string(),
            description: z.string().optional(),
          })
          .optional(),
        history: z
          .array(
            z.object({
              title: z.string(),
              company: z.string(),
              startDate: z.string(),
              endDate: z.string(),
              description: z.string().optional(),
            })
          )
          .optional(),
      })
      .optional(),
  })
  .strict()

// Validation schemas for different tiers
const freeProfileSchema = profileSchema
  .extend({
    // Add free-specific fields
  })
  .strict()

const proProfileSchema = profileSchema
  .extend({
    culinaryInfo: z.object({
      expertise: z.enum(['beginner', 'intermediate', 'advanced', 'professional']),
      specialties: z.array(z.string()),
      certifications: z.array(
        z.object({
          name: z.string(),
          issuer: z.string(),
          date: z.string(),
          expiryDate: z.string().optional(),
          verificationLink: z.string().url().optional(),
        })
      ),
    }),
    businessInfo: z
      .object({
        services: z.array(z.string()).optional(),
        rates: z
          .object({
            hourly: z.string().optional(),
            daily: z.string().optional(),
            project: z.string().optional(),
          })
          .optional(),
        businessHours: z.string().optional(),
        serviceAreas: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .strict()

const groupProfileSchema = proProfileSchema
  .extend({
    organizationInfo: z.object({
      type: z.enum(['restaurant', 'catering', 'food_service', 'other']),
      establishedYear: z.string(),
      size: z.enum(['small', 'medium', 'large']),
      team: z.array(
        z.object({
          role: z.string(),
          count: z.number(),
        })
      ),
    }),
  })
  .strict()

export async function validateProfile(
  metadata: ProfileMetadata,
  tier: ProfileTier
): Promise<{ success: boolean; error?: string }> {
  try {
    let validationSchema: z.ZodSchema

    switch (tier) {
      case 'FREE':
        validationSchema = freeProfileSchema
        break
      case 'PRO':
        validationSchema = proProfileSchema
        break
      case 'GROUP':
        validationSchema = groupProfileSchema
        break
      default:
        return {
          success: false,
          error: 'Invalid profile tier',
        }
    }

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

export type ProfileFormData = z.infer<typeof profileSchema>
export type ProProfileFormData = z.infer<typeof proProfileSchema>
export type GroupProfileFormData = z.infer<typeof groupProfileSchema>
