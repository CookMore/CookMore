import { z } from 'zod'
import { PROFILE_VERSIONS, ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'

// Shared schemas
const SocialLinksSchema = z.object({
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  youtube: z.string().optional(),
})

const CulinaryInfoSchema = z.object({
  expertise: z.enum(['beginner', 'intermediate', 'advanced', 'professional']),
  specialties: z.array(z.string()),
  dietaryPreferences: z.array(z.string()),
  cuisineTypes: z.array(z.string()),
  techniques: z.array(z.string()),
  equipment: z.array(z.string()),
  certifications: z.array(
    z.object({
      name: z.string(),
      issuer: z.string(),
      date: z.string(),
      expiryDate: z.string().optional(),
      verificationLink: z.string().url().optional(),
    })
  ),
})

const BusinessOperationsSchema = z.object({
  locations: z.array(z.string()),
  hours: z.string(),
  capacity: z.object({
    seating: z.number().optional(),
    eventSpace: z.number().optional(),
    trainingCapacity: z.number().optional(),
    maxOccupancy: z.number().optional(),
    privateRooms: z.number().optional(),
  }),
  services: z.array(z.string()),
})

const OrganizationInfoSchema = z.object({
  name: z.string(),
  type: z.enum(['restaurant', 'culinary-school', 'catering', 'food-service', 'other']),
  size: z.enum(['small', 'medium', 'large', 'enterprise']),
  founded: z.string(),
  mission: z.string(),
})

// Base profile schema
export const profileSchema = z.object({
  tier: z.nativeEnum(ProfileTier),
  version: z.enum(PROFILE_VERSIONS),
  basicInfo: z.object({
    name: z.string().min(2),
    bio: z.string(),
    avatar: z.string(),
    banner: z.string().optional(),
    location: z.string(),
    website: z.string().url().optional(),
  }),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string().optional(),
      field: z.string().optional(),
      startYear: z.string(),
      endYear: z.string().optional(),
      location: z.string().optional(),
    })
  ),
  culinaryInfo: CulinaryInfoSchema,
  socialLinks: SocialLinksSchema,
  experience: z
    .object({
      current: z.object({
        title: z.string(),
        company: z.string(),
        location: z.string().optional(),
        startDate: z.string(),
        description: z.string().optional(),
      }),
      history: z.array(
        z.object({
          title: z.string(),
          company: z.string(),
          location: z.string().optional(),
          startDate: z.string(),
          endDate: z.string(),
          description: z.string().optional(),
        })
      ),
    })
    .optional(),
  certifications: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string(),
        date: z.string(),
        expiryDate: z.string().optional(),
        verificationLink: z.string().url().optional(),
      })
    )
    .optional(),
  availability: z
    .object({
      forHire: z.boolean(),
      consulting: z.boolean(),
      collaborations: z.boolean(),
      teaching: z.boolean(),
    })
    .optional(),
  marketing: z
    .object({
      brandColors: z.array(z.string()),
      tagline: z.string(),
      mediaKit: z.string(),
      pressReleases: z.array(z.string()),
      socialMedia: z.array(z.string()),
      promotions: z.array(z.string()),
    })
    .optional(),
  organizationInfo: OrganizationInfoSchema.optional(),
  businessOperations: BusinessOperationsSchema.optional(),
  team: z
    .object({
      size: z.number(),
      roles: z.array(z.string()),
      structure: z.string(),
    })
    .optional(),
  suppliers: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        contact: z.object({
          name: z.string(),
          email: z.string().email(),
          phone: z.string().optional(),
        }),
      })
    )
    .optional(),
  compliance: z
    .object({
      certifications: z.array(z.string()),
      licenses: z.array(z.string()),
      insurance: z.array(z.string()),
    })
    .optional(),
})

// Helper to validate profile data
export function validateProfileData(data: unknown, tier: ProfileTier) {
  return profileSchema.safeParse(data)
}

// Export types
export type ProfileFormData = z.infer<typeof profileSchema>
