import { z } from 'zod'
import { baseProfileSchema, ogStatusSchema, ogCustomizationSchema } from './schemas'

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
