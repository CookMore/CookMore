import { z } from 'zod'
import { baseProfileSchema, ogStatusSchema, ogCustomizationSchema } from './schemas'
import { ProfileTier } from '../profile'

export enum ProfileTierEnum {
  FREE = 0,
  PRO = 1,
  GROUP = 2,
  OG = 3,
}

// Free tier schema
export const freeProfileSchema = baseProfileSchema
  .extend({
    tier: z.literal(ProfileTierEnum.FREE),
  })
  .strict()

// Pro tier schema
export const proProfileSchema = baseProfileSchema
  .extend({
    tier: z.literal(ProfileTierEnum.PRO),
    culinaryInfo: z
      .object({
        certifications: z
          .array(
            z.object({
              name: z.string().min(1, 'Certification name is required'),
              issuer: z.string().min(1, 'Issuer is required'),
              date: z.string(),
              expiryDate: z.string().optional(),
              verificationLink: z.string().url().optional(),
            })
          )
          .optional(),
      })
      .optional(),
    experience: z.object({
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
    }),
  })
  .strict()

// Group tier schema
export const groupProfileSchema = proProfileSchema
  .extend({
    tier: z.literal(ProfileTierEnum.GROUP),
    organizationInfo: z.object({
      type: z.enum(['restaurant', 'culinary-school', 'catering', 'food-service', 'other']),
      establishedYear: z.string(),
      size: z.enum(['small', 'medium', 'large', 'enterprise']),
      team: z.array(
        z.object({
          role: z.string(),
          count: z.number(),
        })
      ),
    }),
  })
  .strict()

// OG tier schema - simplified version
export const ogProfileSchema = groupProfileSchema
  .extend({
    tier: z.literal(ProfileTierEnum.OG),
    ogStatus: ogStatusSchema,
    customization: ogCustomizationSchema,
  })
  .strict()

export type ProfileFormData = z.infer<typeof baseProfileSchema>
export type ProProfileFormData = z.infer<typeof proProfileSchema>
export type GroupProfileFormData = z.infer<typeof groupProfileSchema>
export type OGProfileFormData = z.infer<typeof ogProfileSchema>

export function getProfileSchema(tier: ProfileTier) {
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

// Re-export everything from schemas
export * from './schemas'
