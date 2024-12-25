/**
 * On-chain metadata structure (minimal data stored in contract)
 */
export interface OnChainMetadata {
  name: string
  bio: string
  avatar: string // IPFS hash
  ipfsNotesCID: string // IPFS hash for extended data
}

/**
 * Extended profile data stored in IPFS
 */
export interface ExtendedProfileData {
  version: string
  lastUpdated: string // ISO timestamp

  // Basic Info
  location?: string
  website?: string

  // Business Operations
  businessOperations?: {
    operatingHours: string[]
    serviceTypes: string[]
    deliveryRadius?: string
    capacity?: {
      seating: number
      eventSpace: number
    }
    seasonalMenu: boolean
  }

  // Certifications
  certifications?: Array<{
    name: string
    institution: string
    dateReceived: string
    expiryDate?: string
    verificationHash?: string
  }>

  // Social Links
  social?: {
    twitter?: string
    instagram?: string
    website?: string
  }

  // Additional Media
  media?: {
    gallery?: string[] // IPFS hashes
    documents?: string[] // IPFS hashes
  }
}

/**
 * Complete IPFS metadata structure (follows NFT metadata standards)
 */
export interface IPFSMetadata {
  schema: string
  name: string
  description: string
  image: string
  attributes: ExtendedProfileData
}

/**
 * Profile metadata with both on-chain and IPFS data
 */
export interface CompleteProfileMetadata {
  onChain: OnChainMetadata
  ipfs: IPFSMetadata
}

/**
 * Metadata validation result
 */
export interface MetadataValidationResult {
  valid: boolean
  errors?: string[]
}
