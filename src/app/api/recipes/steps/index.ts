import { TitleDescription } from './TitleDescription'
import { BasicInfo } from './BasicInfo'
import { VersionControl } from './VersionControl'
import { PrivacySettings } from './PrivacySettings'
import { Inspiration } from './Inspiration'
import { NecessarySkills } from './NecessarySkills'
import { Equipment } from './Equipment'
import { HaccpPlan } from './HaccpPlan'
import { Ingredients } from './Ingredients'
import { MethodProduction } from './MethodProduction'
import { ServingPlating } from './ServingPlating'
import { Pairings } from './Pairings'
import { ChangeLog } from './ChangeLog'
import { SpecialtyIngredients } from './SpecialtyIngredients'
import { PreProduction } from './PreProduction'
import { Tags } from './Tags'
import { FinalImage } from './FinalImage'
import { FinishingTouch } from './FinishingTouch'
import { Review } from './Review'
import { Mint } from './Mint'
import { Step } from '@/app/api/types/steps'
import { RecipeData } from '@/app/api/types/recipe'
import { ComponentType } from 'react'
import { useRecipe } from '@/app/providers/RecipeProvider'

// Export this interface so components can use it
export interface StepComponentProps {
  data: RecipeData
  onChange: (data: Partial<RecipeData>) => void
  onNext?: () => void
  onBack?: () => void
  isActive?: boolean
}

export const STEPS: Array<{
  id: string
  label: string
  component: ComponentType<StepComponentProps>
}> = [
  {
    id: 'title-description',
    label: 'Title & Description',
    component: TitleDescription as ComponentType<StepComponentProps>,
  },
  {
    id: 'basic-info',
    label: 'Basic Information',
    component: BasicInfo as ComponentType<StepComponentProps>,
  },
  {
    id: 'version-control',
    label: 'Version Control',
    component: VersionControl as ComponentType<StepComponentProps>,
  },
  {
    id: 'privacy-settings',
    label: 'Privacy Settings',
    component: PrivacySettings as ComponentType<StepComponentProps>,
  },
  {
    id: 'inspiration',
    label: 'Inspiration',
    component: Inspiration as ComponentType<StepComponentProps>,
  },
  {
    id: 'necessary-skills',
    label: 'Required Skills',
    component: NecessarySkills as ComponentType<StepComponentProps>,
  },
  {
    id: 'equipment',
    label: 'Equipment & Tools',
    component: Equipment as ComponentType<StepComponentProps>,
  },
  {
    id: 'haccp-plan',
    label: 'HACCP Plan',
    component: HaccpPlan as ComponentType<StepComponentProps>,
  },
  {
    id: 'ingredients',
    label: 'Ingredients',
    component: Ingredients as ComponentType<StepComponentProps>,
  },
  {
    id: 'method-production',
    label: 'Method & Production',
    component: MethodProduction as ComponentType<StepComponentProps>,
  },
  {
    id: 'serving-plating',
    label: 'Serving & Plating',
    component: ServingPlating as ComponentType<StepComponentProps>,
  },
  {
    id: 'pairings',
    label: 'Pairings',
    component: Pairings as ComponentType<StepComponentProps>,
  },
  {
    id: 'change-log',
    label: 'Change Log',
    component: ChangeLog as ComponentType<StepComponentProps>,
  },
  {
    id: 'specialty-ingredients',
    label: 'Specialty Ingredients',
    component: SpecialtyIngredients as ComponentType<StepComponentProps>,
  },
  {
    id: 'pre-production',
    label: 'Pre-Production',
    component: PreProduction as ComponentType<StepComponentProps>,
  },
  {
    id: 'tags',
    label: 'Tags',
    component: Tags as ComponentType<StepComponentProps>,
  },
  {
    id: 'final-image',
    label: 'Final Image',
    component: FinalImage as ComponentType<StepComponentProps>,
  },
  {
    id: 'finishing-touch',
    label: 'Finishing Touch',
    component: FinishingTouch as ComponentType<StepComponentProps>,
  },
  {
    id: 'review',
    label: 'Digital Signature',
    component: Review as ComponentType<StepComponentProps>,
  },
  {
    id: 'mint',
    label: 'Mint Recipe NFT',
    component: Mint as ComponentType<StepComponentProps>,
  },
] as const

export type StepId = (typeof STEPS)[number]['id']

// Re-export all components
export { TitleDescription } from './TitleDescription'
export { BasicInfo } from './BasicInfo'
export { VersionControl } from './VersionControl'
export { PrivacySettings } from './PrivacySettings'
export { Inspiration } from './Inspiration'
export { NecessarySkills } from './NecessarySkills'
export { Equipment } from './Equipment'
export { HaccpPlan } from './HaccpPlan'
export { Ingredients } from './Ingredients'
export { MethodProduction } from './MethodProduction'
export { ServingPlating } from './ServingPlating'
export { Pairings } from './Pairings'
export { ChangeLog } from './ChangeLog'
export { SpecialtyIngredients } from './SpecialtyIngredients'
export { PreProduction } from './PreProduction'
export { Tags } from './Tags'
export { FinalImage } from './FinalImage'
export { FinishingTouch } from './FinishingTouch'
export { Review } from './Review'
export { Mint } from './Mint'
