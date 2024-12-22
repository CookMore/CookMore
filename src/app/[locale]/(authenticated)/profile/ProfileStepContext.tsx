'use client'

import { createContext, useContext, useState } from 'react'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile'
import { getStepsForTier, type ProfileStep } from '@/app/[locale]/(authenticated)/profile/steps'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getTierValidation } from './validations/profile'
import type { ProfileFormData } from './profile'

interface ProfileStepContextType {
  currentStep: number
  setCurrentStep: (step: number) => void
  steps: ProfileStep[]
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  actualTier: string
  canProgress: boolean
  nextStep: () => void
  prevStep: () => void
  isLastStep: boolean
  isFirstStep: boolean
  formMethods: ReturnType<typeof useForm<ProfileFormData>>
}

const ProfileStepContext = createContext<ProfileStepContextType | undefined>(undefined)

export function ProfileStepProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { hasPro, hasGroup, hasOG, isLoading } = useNFTTiers()

  // Determine actual tier based on NFT ownership
  const actualTier = hasOG
    ? ProfileTier.OG
    : hasGroup
      ? ProfileTier.GROUP
      : hasPro
        ? ProfileTier.PRO
        : ProfileTier.FREE

  const steps = getStepsForTier(actualTier)
  const validationSchema = getTierValidation(actualTier)

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      tier: actualTier,
      name: '',
      bio: '',
      description: '',
      location: '',
      culinaryInfo: {
        expertise: 'beginner',
        specialties: [],
        dietaryPreferences: [],
        cuisineTypes: [],
        techniques: [],
        equipment: [],
      },
    },
  })

  // Navigation functions
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  // Determine if user can progress based on current step validation
  const canProgress = methods.formState.isValid

  const value = {
    currentStep,
    setCurrentStep,
    steps,
    isCollapsed,
    setIsCollapsed,
    actualTier: ProfileTier[actualTier].toLowerCase(),
    canProgress,
    nextStep,
    prevStep,
    isLastStep,
    isFirstStep,
    formMethods: methods,
  }

  // Don't render until NFT status is loaded
  if (isLoading) return null

  return (
    <ProfileStepContext.Provider value={value}>
      <FormProvider {...methods}>{children}</FormProvider>
    </ProfileStepContext.Provider>
  )
}

export function useProfileStep() {
  const context = useContext(ProfileStepContext)
  if (!context) {
    throw new Error('useProfileStep must be used within a ProfileStepProvider')
  }
  return context
}

export function useProfileForm() {
  const context = useContext(ProfileStepContext)
  if (!context) {
    throw new Error('useProfileForm must be used within a ProfileStepProvider')
  }
  return context.formMethods
}
