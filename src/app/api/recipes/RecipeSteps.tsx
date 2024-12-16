'use client'

import { useState, useEffect } from 'react'
import {
  TitleDescription,
  BasicInfo,
  VersionControl,
  PrivacySettings,
  Inspiration,
  NecessarySkills,
  Equipment,
  HaccpPlan,
  Ingredients,
  MethodProduction,
  ServingPlating,
  Pairings,
  ChangeLog,
  SpecialtyIngredients,
  PreProduction,
  Tags,
  FinalImage,
  FinishingTouch,
  Review,
  Mint,
} from './steps'
import { useRecipe } from '@/app/api/providers/RecipeProvider'
import { SavingIndicator } from './SavingIndicator'
import { validateStep } from '../../../[locale]/(authenticated)/recipe/validations/validation'
import { LoadingSkeleton } from '@/app/api/components/ui/LoadingSkeleton'
import type { RecipeData } from '@/app/api/types/recipe'

const STEPS = [
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
  { id: 'mint', component: Mint, label: 'Mint' },
] as const

interface RecipeStepsProps {
  currentStep: number
  setCurrentStep: (step: number) => void
}

export function RecipeSteps({ currentStep, setCurrentStep }: RecipeStepsProps) {
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const { recipeData, updateRecipe, isLoading } = useRecipe()

  useEffect(() => {
    console.log('RecipeSteps mounted', {
      currentStep,
      STEPS,
      currentComponent: STEPS[currentStep]?.component.name,
      recipeData,
    })
  }, [currentStep, recipeData])

  const CurrentStepComponent = STEPS[currentStep]?.component

  if (!CurrentStepComponent) {
    console.error('Step component not found:', { currentStep, STEPS })
    return <div>Error: Step not found</div>
  }

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSkeleton className='space-y-8'>
          <div className='space-y-4'>
            <div className='h-8 bg-github-canvas-subtle rounded w-1/2 mx-auto' />
            <div className='h-2 bg-github-canvas-subtle rounded w-3/4 mx-auto' />
          </div>
          <div className='space-y-6'>
            <div className='h-24 bg-github-canvas-subtle rounded' />
            <div className='grid grid-cols-2 gap-4'>
              <div className='h-12 bg-github-canvas-subtle rounded' />
              <div className='h-12 bg-github-canvas-subtle rounded' />
            </div>
          </div>
        </LoadingSkeleton>
      </PageContainer>
    )
  }

  const handleNext = async () => {
    console.log('Attempting to move to next step', { currentStep, nextStep: currentStep + 1 })

    const stepValidation = await validateStep(STEPS[currentStep].id, recipeData)
    if (Object.keys(stepValidation).length > 0) {
      console.log('Validation failed', stepValidation)
      setErrors(stepValidation)
      return
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
      setErrors({})
      console.log('Moved to next step', { newStep: currentStep + 1 })
    }
  }

  const handleBack = () => {
    console.log('Moving to previous step', { currentStep, prevStep: currentStep - 1 })
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const handleChange = (updates: Partial<RecipeData>) => {
    console.log('Updating recipe data', { updates })
    updateRecipe(updates)
  }

  return (
    <PageContainer>
      <div className='mb-8 text-center'>
        <div className='flex flex-col items-center'>
          <SavingIndicator />
          <h2 className='text-xl font-semibold text-github-fg-default'>
            {STEPS[currentStep].label}
          </h2>
        </div>
        <div className='mt-4 h-2 bg-github-canvas-subtle rounded-full w-9/12 sm:w-3/4 lg:w-full mx-auto'>
          <div
            className='h-full bg-github-accent-emphasis rounded-full transition-all'
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {errors[STEPS[currentStep].id] && (
        <div className='mb-6 p-4 bg-github-danger-subtle border border-github-danger-emphasis rounded-md'>
          <ul className='list-disc list-inside text-sm text-github-danger-fg'>
            {errors[STEPS[currentStep].id].map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <CurrentStepComponent
        data={recipeData}
        onChange={handleChange}
        onNext={handleNext}
        onBack={handleBack}
      />
    </PageContainer>
  )
}

interface PageContainerProps {
  children: React.ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className='flex justify-center w-full px-4 py-6'>
      <div className='w-full max-w-3xl'>{children}</div>
    </div>
  )
}
