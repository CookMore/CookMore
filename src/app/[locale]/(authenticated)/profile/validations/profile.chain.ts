import { z } from 'zod'

// On-chain metadata validation schema
export const OnChainMetadataSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be text',
    })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),

  bio: z
    .string({
      required_error: 'Bio is required',
      invalid_type_error: 'Bio must be text',
    })
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be less than 500 characters'),

  avatar: z
    .string({
      required_error: 'Profile picture is required',
      invalid_type_error: 'Invalid profile picture URL',
    })
    .url('Profile picture must be a valid URL'),

  ipfsNotesCID: z
    .string({
      required_error: 'IPFS CID is required',
      invalid_type_error: 'Invalid IPFS CID',
    })
    .min(1, 'IPFS CID is required'),
})

// Helper to validate on-chain metadata
export function validateOnChainMetadata(data: unknown): z.SafeParseReturnType<any, any> {
  return OnChainMetadataSchema.safeParse(data)
}

// Type for on-chain metadata
export type OnChainMetadata = z.infer<typeof OnChainMetadataSchema>
