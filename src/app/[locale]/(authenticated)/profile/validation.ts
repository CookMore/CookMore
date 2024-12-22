import { z } from 'zod'
import type { ProfileMetadata, ProfileTier } from './profile'

// Define the enum for runtime use while keeping the type import
export enum ProfileTierEnum {
  FREE = 0,
  PRO = 1,
  GROUP = 2,
  OG = 3,
}

const socialLinksSchema = z.object({
  urls: z.array(z.string().url()),
  labels: z.array(z.string()),
})

const preferencesSchema = z
  .object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    notifications: z.boolean().optional(),
    privacy: z.enum(['public', 'private', 'connections']).optional(),
  })
  .optional()

// Base profile schema with common fields across all tiers
export const baseProfileSchema = z
  .object({
    version: z.string().optional(),
    tier: z.nativeEnum(ProfileTierEnum),
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name is too long')
      .or(z.literal('')),
    bio: z
      .string()
      .min(10, 'Bio must be at least 10 characters')
      .max(500, 'Bio is too long')
      .or(z.literal(''))
      .optional(),
    description: z.string().optional(),
    avatar: z.string().optional(),
    image: z.union([z.string(), z.instanceof(File)]).optional(),
    banner: z.string().optional(),
    location: z.string().optional(),
    social: socialLinksSchema.optional(),
    preferences: preferencesSchema.optional(),
    culinaryInfo: z
      .object({
        expertise: z.enum(['beginner', 'intermediate', 'advanced', 'professional']),
        specialties: z.array(z.string()),
        dietaryPreferences: z.array(z.string()),
        cuisineTypes: z.array(z.string()),
        techniques: z.array(z.string()),
        equipment: z.array(z.string()),
      })
      .optional(),
    achievements: z
      .object({
        recipesCreated: z.number().default(0),
        recipesForked: z.number().default(0),
        totalLikes: z.number().default(0),
        badges: z.array(z.string()).default([]),
        featuredIn: z
          .array(
            z.object({
              publication: z.string(),
              title: z.string(),
              date: z.string(),
              link: z.string().url().optional(),
            })
          )
          .optional(),
        competitions: z
          .array(
            z.object({
              name: z.string(),
              position: z.string(),
              date: z.string(),
              description: z.string().optional(),
            })
          )
          .optional(),
      })
      .optional(),
  })
  .strict()

// Free tier schema - just the base schema
export const freeProfileSchema = baseProfileSchema.strict()

// Pro tier schema - extends base with professional fields
export const proProfileSchema = baseProfileSchema
  .extend({
    title: z.string().optional(),
    company: z.string().optional(),
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
            location: z.string().optional(),
            startDate: z.string(),
            endDate: z.string(),
            description: z.string().optional(),
          })
        )
        .optional(),
    }),
    education: z
      .array(
        z.object({
          institution: z.string(),
          degree: z.string().optional(),
          field: z.string().optional(),
          startYear: z.string(),
          endYear: z.string().optional(),
          location: z.string().optional(),
        })
      )
      .optional(),
    awards: z
      .array(
        z.object({
          name: z.string(),
          issuer: z.string(),
          date: z.string(),
          description: z.string().optional(),
          link: z.string().url().optional(),
        })
      )
      .optional(),
    languages: z
      .array(
        z.object({
          language: z.string(),
          proficiency: z.enum(['basic', 'intermediate', 'fluent', 'native']),
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
    businessInfo: z
      .object({
        businessHours: z.string().optional(),
        services: z.array(z.string()).optional(),
        serviceAreas: z.array(z.string()).optional(),
        rates: z
          .object({
            hourly: z.string().optional(),
            daily: z.string().optional(),
            project: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .strict()

// Group tier schema - extends pro with organization fields
export const groupProfileSchema = proProfileSchema
  .extend({
    baseName: z.string(),
    organizationInfo: z.object({
      type: z.enum(['restaurant', 'culinary-school', 'catering', 'food-service', 'other']),
      establishedYear: z.string(),
      size: z.enum(['small', 'medium', 'large', 'enterprise']),
      branches: z
        .array(
          z.object({
            name: z.string(),
            location: z.string(),
            isHeadquarters: z.boolean(),
            contactInfo: z.object({
              phone: z.string().optional(),
              email: z.string().email().optional(),
              address: z.string(),
            }),
          })
        )
        .optional(),
      team: z.array(
        z.object({
          role: z.string(),
          count: z.number(),
          requirements: z.array(z.string()).optional(),
        })
      ),
    }),
    facilities: z
      .array(
        z.object({
          type: z.enum(['kitchen', 'dining', 'training', 'storage', 'other']),
          capacity: z.number(),
          features: z.array(z.string()),
          equipment: z.array(z.string()).optional(),
          maintenanceSchedule: z
            .array(
              z.object({
                item: z.string(),
                lastMaintenance: z.string(),
                nextMaintenance: z.string(),
                responsible: z.string().optional(),
              })
            )
            .optional(),
        })
      )
      .optional(),
    compliance: z.object({
      certifications: z.array(
        z.object({
          type: z.string(),
          issuer: z.string(),
          validUntil: z.string(),
          verificationLink: z.string().url().optional(),
        })
      ),
      licenses: z.array(
        z.object({
          type: z.string(),
          number: z.string(),
          jurisdiction: z.string(),
          validUntil: z.string(),
        })
      ),
      inspections: z
        .array(
          z.object({
            date: z.string(),
            authority: z.string(),
            rating: z.string(),
            report: z.string().optional(),
            nextInspectionDue: z.string().optional(),
            remediationRequired: z.boolean().optional(),
            remediationNotes: z.string().optional(),
          })
        )
        .optional(),
      insurance: z
        .array(
          z.object({
            type: z.string(),
            provider: z.string(),
            policyNumber: z.string(),
            coverage: z.string(),
            validUntil: z.string(),
          })
        )
        .optional(),
    }),
  })
  .strict()

// OG tier schema - extends group with OG-specific fields
export const ogProfileSchema = groupProfileSchema
  .extend({
    ogPreferences: z.object({
      mentorship: z.boolean().optional(),
      investment: z.boolean().optional(),
      collaboration: z.boolean().optional(),
      advisory: z.boolean().optional(),
    }),
    ogShowcase: z.object({
      signature_dishes: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
          image: z.string().optional(),
          story: z.string().optional(),
        })
      ),
      innovations: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
            impact: z.string(),
            date: z.string(),
          })
        )
        .optional(),
      media_features: z
        .array(
          z.object({
            outlet: z.string(),
            title: z.string(),
            date: z.string(),
            link: z.string().url().optional(),
            description: z.string().optional(),
          })
        )
        .optional(),
    }),
    ogNetwork: z.object({
      mentees: z.array(z.string()).optional(),
      collaborators: z.array(z.string()).optional(),
      investments: z
        .array(
          z.object({
            project: z.string(),
            role: z.string(),
            date: z.string(),
            status: z.enum(['active', 'exited', 'closed']),
          })
        )
        .optional(),
    }),
  })
  .strict()

export function getTierValidation(tier: ProfileTier) {
  switch (tier) {
    case ProfileTierEnum.FREE:
      return freeProfileSchema
    case ProfileTierEnum.PRO:
      return proProfileSchema
    case ProfileTierEnum.GROUP:
      return groupProfileSchema
    case ProfileTierEnum.OG:
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

export type ProfileFormData = z.infer<typeof baseProfileSchema>
export type ProProfileFormData = z.infer<typeof proProfileSchema>
export type GroupProfileFormData = z.infer<typeof groupProfileSchema>
export type OGProfileFormData = z.infer<typeof ogProfileSchema>
