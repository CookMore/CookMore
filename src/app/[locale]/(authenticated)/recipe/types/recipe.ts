// Core Metadata Interface
export interface RecipeMetadata {
  id?: string
  title: string
  description: string
  version?: string
  owner?: string
  status?: VersionStatus
  visibility?: PrivacyLevel
  license?: string
  createdAt?: Date
  updatedAt?: Date
  // Add other metadata fields as needed
}

// Main Recipe Data Interface
export interface RecipeData extends RecipeMetadata {
  servings?: number
  prepTime: number
  cookTime: number
  difficulty?: Difficulty
  dietary?: string[]
  portionSize?: string
  totalYield?: string
  categories?: string[]
  cuisines?: string[]
  occasions?: string[]
  tags?: string[]
  customTags?: string[]
  skills: Skills
  ingredients?: IngredientGroup[]
  specialtyIngredients?: SpecialtyIngredient[]
  equipment: Equipment[]
  preProduction: PreProductionTask[]
  productionMethod?: MethodProduction
  haccpPlan: HaccpPlan[]
  servingPlating?: ServingPlating
  finishingTouch?: FinishingTouch
  finalImage?: string
  coverImage?: string
  videoUrl?: string
  inspiration?: Inspiration
  signatures?: Signature[]
  versions?: RecipeVersion[]
  currentVersionId?: string
  forks?: string[]
  isDraft?: boolean
  cookCount?: number
  likes?: number
  comments?: number
  image?: string
  changeLogDetails?: {
    entries: ChangeLogEntry[]
  }
}

// Supporting Types and Interfaces
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'
export type VersionStatus = 'alpha' | 'beta' | 'stable'
export type PrivacyLevel = 'private' | 'allowlist' | 'public'

export interface Signature {
  address: string
  signature: string
  timestamp: number
}

export interface IngredientGroup {
  groupName?: string
  items: IngredientItem[]
}

export interface IngredientItem {
  ingredient: string
  quantity: string
  unit: string
}

export interface Equipment {
  name: string
  quantity: number
  optional?: boolean
}

export interface HaccpPlan {
  step: string
  hazards: string[]
  controls: string[]
}

export interface FinishingTouch {
  notes?: string
  presentation?: string
  image?: string
}

export interface Skills {
  required: string[]
  recommended?: string[]
  certifications?: string[]
  training?: string[]
}

export interface SpecialtyIngredient {
  item: string
  source: string
  substitute: string
  notes: string
  handling: string
}

export interface PreProductionTask {
  task: string
  timeframe: string
  notes: string
}

export interface ProductionStep {
  id: string
  type: string
  content: string
  time?: number
  timeUnit: 'minutes' | 'hours'
  ingredients: string[]
  warning?: string
  notes?: string[]
  image?: string
}

export interface ServingPlating {
  instructions: string[]
  temperature: string
  timing: string
  notes?: string
  presentation?: string[]
  garnish?: string[]
  service?: string[]
  image?: string
}

export interface Review {
  notes?: string
  improvements?: string[]
  rating?: number
  comments?: string
}

export interface ChangeLogEntry {
  version: string
  type: string
  date: string
  author: string
  message: string
}

export interface Variation {
  name: string
  description: string
  changes: string[]
}

export interface PairingCategory {
  category: string
  items: string[]
  notes?: string
}

export interface ProductionModule {
  id: string
  title: string
  steps: ProductionStep[]
}

export interface Reviewer {
  address: string
  hasSigned: boolean
  signature?: string
  timestamp?: number
}

// Additional Interfaces for New Sections
export interface PrivacySettings {
  allowlist?: string[]
}

export interface NecessarySkills {
  skills: Skills
}

export interface MethodProduction {
  defaultFlow: ProductionStep[]
  modules?: ProductionModule[]
}

export interface ServingPlatingDetails {
  instructions: string[]
  temperature: string
  timing: string
}

export interface PairingsDetails {
  pairings: PairingCategory[]
}

export interface ChangeLogDetails {
  entries: ChangeLogEntry[]
}

export interface SpecialtyIngredientsDetails {
  specialtyIngredients: SpecialtyIngredient[]
}

export interface PreProductionDetails {
  tasks: PreProductionTask[]
}

export interface TagsDetails {
  categories: string[]
  cuisines: string[]
  occasions: string[]
  customTags: string[]
}

export interface FinalImageDetails {
  finalImage: string
}

export interface FinishingTouchDetails {
  notes: string[]
}

export interface ReviewDetails {
  signatures: Signature[]
}

export interface MintDetails {
  reviewers: Reviewer[]
}

export interface Inspiration {
  sources?: string[]
  images?: string[]
  notes?: string
}

// Type aliases for backward compatibility
export type Recipe = RecipeData

// Version-related types
export interface RecipeVersion {
  id: string
  message: string
  changes: Partial<RecipeData>
  timestamp: Date
  parentId: string | null
}

// Service response types
export interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface RecipeActionResponse extends ServiceResponse<RecipeData> {
  action: 'create' | 'update' | 'delete' | 'fork'
  timestamp: Date
}

// Define the HaccpStep interface
export interface HaccpStep {
  step: string
  hazards: string[]
  controls: string[]
  criticalLimits: string[]
  monitoring: {
    what: string
    how: string
    when: string
    who: string
  }
  correctiveActions: string[]
  verification: string[]
  records: string[]
}

export * from './recipe'
