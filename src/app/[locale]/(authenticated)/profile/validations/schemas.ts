import { z } from 'zod'

export const socialLinksSchema = z.object({
  urls: z.array(z.string().url()),
  labels: z.array(z.string()),
})

export const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  notifications: z.boolean().optional(),
  privacy: z.enum(['public', 'private', 'connections']).optional(),
})

const urlOrIpfsSchema = z.string().refine(
  (value) => {
    if (!value) return true // Allow empty strings
    return (
      value.startsWith('http://') || value.startsWith('https://') || value.startsWith('ipfs://')
    )
  },
  {
    message: 'Must be a valid URL or IPFS address',
  }
)

export const baseProfileSchema = z.object({
  version: z.string().optional(),
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
  avatar: urlOrIpfsSchema.optional(),
  image: z.union([z.string(), z.instanceof(File)]).optional(),
  banner: urlOrIpfsSchema.optional(),
  location: z.string().optional(),
  social: socialLinksSchema.optional(),
  preferences: preferencesSchema.optional(),
})

export const ogStatusSchema = z.object({
  memberNumber: z.number().min(1, 'Member number is required'),
  joinDate: z.string(),
  legacy: z.boolean().default(false),
})

export const ogCustomizationSchema = z.object({
  theme: z.object({
    primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
    accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
  }),
})
