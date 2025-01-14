/**
 * On-chain metadata structure (minimal data stored in contract)
 */
export interface OnChainMetadata {
  title: string
  description: string
  image: string // IPFS hash
  ipfsNotesCID: string // IPFS hash for extended data
}

export interface NFTMetadata extends IPFSMetadata {
  properties: {
    static_render: string
    recipe_data: ExtendedRecipeData
    tier_info: {
      tier: string
      tier_level: number
      mint_date: string
    }
  }
}

interface BasicInfo {
  title: string
  description?: string
  image?: string
  cuisine?: string
  tags?: string[]
}

export interface ExtendedRecipeData {
  version: string
  lastUpdated: string // ISO timestamp

  // Ingredients
  ingredients?: Array<{
    name: string
    quantity: string
    type?: string
  }>

  // Method
  method?: {
    steps: string[]
    difficulty: string
  }

  // Nutrition
  nutrition?: {
    calories: number
    protein: string
    fat: string
    carbohydrates: string
  }

  // Additional Media
  media?: {
    gallery?: string[] // IPFS hashes
    documents?: string[] // IPFS hashes
  }
}

export interface IPFSMetadata {
  schema: string
  name: string
  description: string
  image: string
  attributes: ExtendedRecipeData
}

export interface CompleteRecipeMetadata {
  onChain: OnChainMetadata
  ipfs: IPFSMetadata
}

export interface RecipeMetadata {
  basicInfo: BasicInfo
  // ... other properties ...
}

export interface MetadataValidationResult {
  valid: boolean
  errors?: string[]
}
