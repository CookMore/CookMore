'use client'

import React, { useState, useEffect } from 'react'
import { StepsSidebar } from '@/app/[locale]/(authenticated)/recipe/ui/StepsSidebar'
import { RecipeCertificate } from '@/app/[locale]/(authenticated)/recipe/ui/RecipeCertificate'
import { IconEye, IconEdit } from '@/app/api/icons'
import { SessionWarning } from '@/app/[locale]/(authenticated)/recipe/steps/SessionWarning'
import { RecipeLoadingSkeleton } from '@/app/[locale]/(authenticated)/recipe/ui/RecipeLoadingSkeleton'
import { useForm, FormProvider } from 'react-hook-form'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { useTheme } from '@/app/api/providers/core/ThemeProvider'
import { useRecipe } from '../context/RecipeContext'
import { RecipeCreationHeader } from '../ui/RecipeCreationHeader'
import { RecipeMintStatus } from '../ui/RecipeMintStatus'
import {
  RecipeMetadataService,
  GenerationProgress,
} from '@/app/[locale]/(authenticated)/recipe/services/client/recipe.metadata.service'
import { recipeIpfsService } from '../services/ipfs/recipe.ipfs.service'
import { STEPS } from '../steps/steps'
import { cn } from '@/app/api/utils/utils'
import { DualSidebarLayout } from '@/app/api/layouts/DualSidebarLayout'
import { RecipeMint } from '../ui/RecipeMint'
import { TitleDescription } from '../steps/TitleDescription'
import { BasicInfo } from '../steps/BasicInfo'
import { VersionControl } from '../steps/VersionControl'
import { PrivacySettings } from '../steps/PrivacySettings'
import { Inspiration } from '../steps/Inspiration'
import { NecessarySkills } from '../steps/NecessarySkills'
import { Equipment } from '../steps/Equipment'
import { HaccpPlan } from '../steps/HaccpPlan'
import { Ingredients } from '../steps/Ingredients'
import { MethodProduction } from '../steps/MethodProduction'
import { ServingPlating } from '../steps/ServingPlating'
import { Pairings } from '../steps/Pairings'
import { ChangeLog } from '../steps/ChangeLog'
import { SpecialtyIngredients } from '../steps/SpecialtyIngredients'
import { PreProduction } from '../steps/PreProduction'
import { Tags } from '../steps/Tags'
import { FinalImage } from '../steps/FinalImage'
import { FinishingTouch } from '../steps/FinishingTouch'
import { Review } from '../steps/Review'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { recipeMetadataSchema, recipeDataSchema } from '../validations/recipe'
import { RecipeData, RecipeTier } from '@/app/[locale]/(authenticated)/recipe/types/recipe'

const availableSteps = STEPS.filter((step) => {
  // Add any filtering logic here if needed
  return true // Example: return all steps
})

export default function CreateRecipeClient({ mode }: { mode: 'create' | 'edit' }) {
  const t = useTranslations('recipe')
  const { theme } = useTheme()
  const {
    currentStep,
    setCurrentStep,
    recipeData,
    updateRecipe,
    isLoading,
    savingStatus,
    lastSaved,
  } = useRecipe()
  const { currentTier } = useAuth()

  const methods = useForm()

  const [validationResults, setValidationResults] = useState<Record<string, string[]>>({})

  useEffect(() => {
    async function fetchData() {
      try {
        const data = mode === 'edit' ? await fetchExistingRecipeData() : getDefaultValues()
        updateRecipe(data)
      } catch (error) {
        console.error('Error fetching recipe data:', error)
        toast.error('Failed to fetch recipe data')
      }
    }
    fetchData()
  }, [mode, updateRecipe])

  async function fetchExistingRecipeData() {
    try {
      // Fetch existing recipe data logic here
      return {} // Replace with actual data fetching logic
    } catch (error) {
      console.error('Error fetching existing recipe data:', error)
      return {}
    }
  }

  function getDefaultValues() {
    return {
      // Add default fields as needed
    }
  }

  const {
    control,
    formState: { errors },
    watch,
  } = methods

  const [isExpanded, setIsExpanded] = useState(true)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(true)
  const [isMintOpen, setIsMintOpen] = useState<boolean>(false)
  const [isMinting, setIsMinting] = useState<boolean>(false)
  const [canMint, setCanMint] = useState<boolean>(false)
  const [mintStatus, setRecipeMintStatus] = useState<RecipeMintStatus | null>(null)
  const [previewData, setPreviewData] = useState<{
    staticPreview?: File
    dynamicRenderer?: string
  } | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)

  const validateCurrentStep = async (stepId: string) => {
    const validationErrors = await validateStep(stepId, recipeData)
    setValidationResults((prev) => ({ ...prev, [stepId]: validationErrors[stepId] || [] }))
    return validationErrors
  }

  const handleNextStep = async (currentStepId: string, nextStepId: string) => {
    const errors = await validateCurrentStep(currentStepId)
    if (Object.keys(errors).length === 0) {
      // Proceed to next step
      setCurrentStep(nextStepId)
    } else {
      // Handle validation errors
      console.log('Validation errors:', errors)
    }
  }

  const renderStep = () => {
    const commonProps = {
      theme,
      control,
      errors,
      onValidationChange: setCanMint,
      data: recipeData as RecipeData,
      onChange: updateRecipe,
      isActive: true,
    }

    const currentStepData = STEPS[currentStep]
    if (!currentStepData) return null

    switch (currentStepData.id) {
      case 'title':
        return <TitleDescription {...commonProps} />
      case 'basic':
        return <BasicInfo {...commonProps} />
      case 'version':
        return <VersionControl {...commonProps} />
      case 'privacy':
        return <PrivacySettings {...commonProps} />
      case 'inspiration':
        return <Inspiration {...commonProps} />
      case 'skills':
        return <NecessarySkills {...commonProps} />
      case 'equipment':
        return <Equipment {...commonProps} />
      case 'haccp':
        return <HaccpPlan {...commonProps} />
      case 'ingredients':
        return <Ingredients {...commonProps} />
      case 'method':
        return <MethodProduction {...commonProps} />
      case 'serving':
        return <ServingPlating {...commonProps} />
      case 'pairings':
        return <Pairings {...commonProps} />
      case 'changelog':
        return <ChangeLog {...commonProps} />
      case 'specialty':
        return <SpecialtyIngredients {...commonProps} />
      case 'preproduction':
        return <PreProduction {...commonProps} />
      case 'tags':
        return <Tags {...commonProps} />
      case 'final-image':
        return <FinalImage {...commonProps} />
      case 'finishing':
        return <FinishingTouch {...commonProps} />
      case 'review':
        return <Review {...commonProps} />
      default:
        return null
    }
  }

  const handleBasicInfoSubmit = (data: BasicInfoFormData) => {
    // Handle form submission for basic info
    console.log('Basic Info Submitted:', data)
  }

  const handleSubmit = async () => {
    const formData = methods.getValues()
    if (mode === 'edit') {
      // Call updateMetadata function
      await updateMetadata(formData)
    } else {
      // Call mint function
      await mintRecipe(formData)
    }
  }

  // Define the handler functions
  const handleExpandChange = (expanded: boolean) => {
    // Logic to handle expand change
    console.log('Expand changed:', expanded)
  }

  const handleVisibilityChange = (visible: boolean) => {
    // Logic to handle visibility change
    console.log('Visibility changed:', visible)
  }

  const handlePopoverChange = (show: boolean) => {
    // Logic to handle popover change
    console.log('Popover changed:', show)
  }

  const isSaving = savingStatus === 'saving'

  // Define the nextStep function
  const nextStep = () => {
    if (currentStep < availableSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Define the prevStep function
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Ensure isFirstStep and isLastStep are defined
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === availableSteps.length - 1

  console.log('CreateRecipeClient - recipeData:', recipeData)
  console.log('CreateRecipeClient - formData:', watch())
  console.log('CreateRecipeClient - isOpen:', isPreviewOpen)

  if (isLoading) {
    return <RecipeLoadingSkeleton />
  }

  return (
    <FormProvider {...methods}>
      <div className='flex flex-col lg:flex-row lg:space-x-4'>
        <div className='flex-1'>
          {mode === 'edit' && (
            <div className='bg-yellow-100 text-yellow-800 p-4 rounded mb-4'>
              You are in Edit Mode
            </div>
          )}
          <DualSidebarLayout
            leftSidebar={
              <StepsSidebar
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                validationResults={validationResults}
              />
            }
            isLeftSidebarExpanded={true}
            className='w-full'
          >
            <div className='flex flex-col w-full'>
              <SessionWarning
                onExpandChange={handleExpandChange}
                onVisibilityChange={handleVisibilityChange}
                onPopoverChange={handlePopoverChange}
              />
              <div className='space-y-4 mt-3'>
                <RecipeCreationHeader
                  tier={currentTier as unknown as RecipeTier}
                  currentStep={currentStep + 1}
                  totalSteps={availableSteps.length}
                  isSaving={isSaving}
                  lastSaved={lastSaved}
                  canMint={canMint}
                  onShowPreview={() => setIsPreviewOpen(true)}
                  onCreateBadge={() => setIsMintOpen(true)}
                  isPreviewOpen={isPreviewOpen}
                  isMinting={isMinting}
                  generationProgress={isGeneratingPreview ? { stage: 'preparing' } : undefined}
                  mode={mode}
                />
                <div className='flex flex-col lg:flex-row lg:space-x-4 h- [600px]'>
                  <div className='flex-1 lg:w-2/3 space-y-4 border border-gray-300 p-4'>
                    {renderStep()}
                  </div>
                  <div className='flex-1 lg:w-1/3 border border-gray-300 p-4'>
                    <RecipeCertificate
                      recipeData={recipeData as RecipeData}
                      validationErrors={Object.entries(validationResults).map(([key, value]) => ({
                        [key]: value.join(', '),
                      }))}
                      formData={watch()}
                      isOpen={true}
                    />
                  </div>
                </div>
                <div className='flex justify-between items-center mt-8 pt-4 border-t border-github-border-default'>
                  <button
                    onClick={prevStep}
                    disabled={isFirstStep}
                    className={cn(
                      'px-4 py-2 rounded-md border font-medium',
                      'transition-colors duration-200',
                      !isFirstStep
                        ? 'border-github-border-default text-github-fg-default hover:bg-github-canvas-subtle'
                        : 'border-github-border-muted text-github-fg-muted cursor-not-allowed'
                    )}
                  >
                    {t('previous')}
                  </button>
                  <button
                    onClick={isLastStep ? handleSubmit : nextStep}
                    className={cn(
                      'px-4 py-2 rounded-md font-medium',
                      'transition-colors duration-200',
                      'bg-github-accent-emphasis text-github-fg-onEmphasis hover:bg-github-accent-muted'
                    )}
                  >
                    {isLastStep ? (mode === 'edit' ? t('update') : t('mint')) : t('next')}
                  </button>
                </div>
              </div>
            </div>
          </DualSidebarLayout>
        </div>
      </div>

      <RecipeMint
        isOpen={isMintOpen}
        onClose={() => {
          setIsMintOpen(false)
          setPreviewData(null)
          previewMountedRef.current = false
        }}
        tier={currentTier as unknown as RecipeTier}
        formData={watch()}
        onComplete={async () => {
          setIsMintOpen(false)
          window.location.href = '/recipe'
        }}
        canMint={canMint && !isGeneratingPreview}
      />

      {mintStatus && <RecipeMintStatus status={mintStatus} />}
    </FormProvider>
  )
}
