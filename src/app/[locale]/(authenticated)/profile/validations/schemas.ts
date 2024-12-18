import { z } from 'zod'
import { ProfileTier } from '../profile'

// Base schema shared across all tiers
const baseProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  bio: z.string().max(500, 'Bio is too long').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
})

// Free tier schema - basic profile info only
export const freeProfileSchema = baseProfileSchema.extend({
  tier: z.literal(ProfileTier.FREE),
})

// Pro tier schema - adds professional info
export const proProfileSchema = baseProfileSchema.extend({
  tier: z.literal(ProfileTier.PRO),
  experience: z.object({
    years: z.number().min(0, 'Invalid years of experience'),
    specialties: z.array(z.string()).min(1, 'At least one specialty required'),
    certifications: z.array(z.string()).optional(),
  }),
  socialLinks: z
    .object({
      website: z.string().url('Invalid website URL').optional(),
      twitter: z.string().optional(),
      instagram: z.string().optional(),
    })
    .optional(),
})

// Group tier schema - adds organization info
export const groupProfileSchema = baseProfileSchema.extend({
  tier: z.literal(ProfileTier.GROUP),
  organizationInfo: z.object({
    name: z.string().min(2, 'Organization name must be at least 2 characters'),
    type: z.enum(['restaurant', 'catering', 'school', 'other']),
    size: z.number().min(1, 'Invalid organization size'),
    location: z.string().min(2, 'Location is required'),
  }),
  compliance: z.object({
    hasHealthPermit: z.boolean(),
    permitNumber: z.string().optional(),
    lastInspectionDate: z.string().optional(),
  }),
  businessHours: z
    .array(
      z.object({
        day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
        open: z.string(),
        close: z.string(),
        closed: z.boolean().optional(),
      })
    )
    .optional(),
})

// OG tier schema - extends Group tier with additional features
export const ogProfileSchema = groupProfileSchema.extend({
  tier: z.literal(ProfileTier.OG),
  ogBenefits: z.object({
    joinDate: z.string(),
    memberNumber: z.number().min(1).max(500),
    customBranding: z.object({
      primaryColor: z.string(),
      secondaryColor: z.string(),
      logo: z.string().url('Invalid logo URL').optional(),
    }),
    apiAccess: z.object({
      enabled: z.boolean(),
      apiKey: z.string().optional(),
      allowedEndpoints: z.array(z.string()).optional(),
    }),
  }),
  verificationStatus: z.object({
    verified: z.boolean(),
    verificationDate: z.string().optional(),
    verifier: z.string().optional(),
  }),
})

// Helper function to get the appropriate schema based on tier
export function getProfileSchema(tier: ProfileTier) {
  switch (tier) {
    case ProfileTier.OG:
      return ogProfileSchema
    case ProfileTier.GROUP:
      return groupProfileSchema
    case ProfileTier.PRO:
      return proProfileSchema
    default:
      return freeProfileSchema
  }
}

// Types
export type FreeProfileMetadata = z.infer<typeof freeProfileSchema>
export type ProProfileMetadata = z.infer<typeof proProfileSchema>
export type GroupProfileMetadata = z.infer<typeof groupProfileSchema>
export type OGProfileMetadata = z.infer<typeof ogProfileSchema>
export type ProfileMetadata =
  | FreeProfileMetadata
  | ProProfileMetadata
  | GroupProfileMetadata
  | OGProfileMetadata
