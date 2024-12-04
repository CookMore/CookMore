import { ComponentType } from 'react'
import { RecipeData } from './recipe'

export interface StepComponentProps {
  data: Partial<RecipeData>
  onChange: (updates: Partial<RecipeData>) => void
  onNext?: () => void
  onBack?: () => void
  isActive?: boolean
}

export interface Step {
  id: string
  label: string
  component: ComponentType<StepComponentProps>
}

export type StepId =
  | 'title-description'
  | 'basic-info'
  | 'version-control'
  | 'privacy-settings'
  | 'inspiration'
  | 'necessary-skills'
  | 'equipment'
  | 'haccp-plan'
  | 'ingredients'
  | 'method-production'
  | 'serving-plating'
  | 'pairings'
  | 'change-log'
  | 'specialty-ingredients'
  | 'pre-production'
  | 'tags'
  | 'final-image'
  | 'finishing-touch'
  | 'review'
  | 'mint'
