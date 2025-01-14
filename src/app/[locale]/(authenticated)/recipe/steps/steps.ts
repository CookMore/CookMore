// Import the components
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

// Define the steps
export const STEPS = [
  { id: 'title', component: TitleDescription, label: 'Title & Description' },
  { id: 'basic', component: BasicInfo, label: 'Basic Information' },
  { id: 'version', component: VersionControl, label: 'Version Control' },
  { id: 'privacy', component: PrivacySettings, label: 'Privacy Settings' },
  { id: 'inspiration', component: Inspiration, label: 'Inspiration' },
  { id: 'skills', component: NecessarySkills, label: 'Required Skills' },
  { id: 'equipment', component: Equipment, label: 'Equipment & Tools' },
  { id: 'haccp', component: HaccpPlan, label: 'HACCP Plan' },
  { id: 'ingredients', component: Ingredients, label: 'Ingredients' },
  { id: 'method', component: MethodProduction, label: 'Method of Production' },
  { id: 'serving', component: ServingPlating, label: 'Serving & Plating' },
  { id: 'pairings', component: Pairings, label: 'Pairings' },
  { id: 'changelog', component: ChangeLog, label: 'Change Log' },
  { id: 'specialty', component: SpecialtyIngredients, label: 'Specialty Ingredients' },
  { id: 'preproduction', component: PreProduction, label: 'Pre-Production' },
  { id: 'tags', component: Tags, label: 'Tags' },
  { id: 'final-image', component: FinalImage, label: 'Final Image' },
  { id: 'finishing', component: FinishingTouch, label: 'Finishing Touch' },
  { id: 'review', component: Review, label: 'Review' },
]
