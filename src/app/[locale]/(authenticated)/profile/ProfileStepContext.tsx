'use client'

import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { Step, getStepsForTier } from './steps'
import { ProfileTier, CURRENT_PROFILE_VERSION } from './profile'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getTierValidation } from './validations/profile'
import type { ProfileFormData } from './profile'
import { useAuth } from '@/app/api/auth/hooks/useAuth'

interface ProfileStepContextType {
  currentStep: number
  setCurrentStep: (step: number) => void
  steps: Step[]
  maxSteps: number
  canGoNext: boolean
  canGoPrevious: boolean
  goToNextStep: () => void
  goToPreviousStep: () => void
  formMethods: ReturnType<typeof useForm<ProfileFormData>>
  actualTier: ProfileTier
  isLoading: boolean
  hasProfile: boolean
}

const ProfileStepContext = createContext<ProfileStepContextType | undefined>(undefined)

export function ProfileStepProvider({
  children,
  tier = ProfileTier.FREE,
}: {
  children: React.ReactNode
  tier?: ProfileTier
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<Step[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const { currentTier, isLoading: isAuthLoading, user, ready } = useAuth()

  // Track auth data and profile existence
  const [hasProfile, setHasProfile] = useState(false)
  const [isProfileChecked, setIsProfileChecked] = useState(false)

  // Check profile existence
  useEffect(() => {
    let isMounted = true

    async function checkProfile() {
      if (!ready || !user?.wallet?.address) return

      try {
        const profileResponse = await fetch(`/api/profile/${user.wallet.address}`)
        const profileData = await profileResponse.json()

        if (isMounted) {
          console.log('Profile check:', profileData)
          setHasProfile(!!profileData?.data?.exists)
          setIsProfileChecked(true)
        }
      } catch (error) {
        console.error('Error checking profile:', error)
        if (isMounted) {
          setIsProfileChecked(true)
          setHasProfile(false)
        }
      }
    }

    if (ready && user?.wallet?.address) {
      console.log('Checking profile for:', user.wallet.address)
      checkProfile()
    }

    return () => {
      isMounted = false
    }
  }, [ready, user?.wallet?.address])

  // Reset data if wallet changes
  useEffect(() => {
    if (!ready || !user?.wallet?.address) {
      setIsInitialized(false)
      setHasProfile(false)
      setIsProfileChecked(false)
    }
  }, [ready, user?.wallet?.address])

  // Determine actual tier
  const actualTier = currentTier || tier

  // Simplified loading condition
  const isLoading = useMemo(() => {
    const loading = isAuthLoading || !isProfileChecked || !ready

    console.log('Loading state:', {
      isAuthLoading,
      ready,
      isInitialized,
      isProfileChecked,
      hasProfile,
      loading,
      currentTier,
      actualTier,
    })
    return loading
  }, [isAuthLoading, ready, isInitialized, isProfileChecked, currentTier, actualTier])

  // Initialize form with correct tier after data is stable
  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(getTierValidation(actualTier)),
    mode: 'onChange',
    defaultValues: {
      basicInfo: {
        name: '',
        bio: '',
        avatar: '',
        banner: '',
        location: '',
        social: {
          twitter: '',
          website: '',
        },
      },
      socialLinks: {
        twitter: '',
        instagram: '',
        website: '',
      },
      tier: actualTier,
      version: CURRENT_PROFILE_VERSION,
    },
  })

  // Initialize steps immediately when we have tier data
  useEffect(() => {
    if (!isInitialized && isProfileChecked) {
      console.log('Initializing steps for tier:', { actualTier, hasProfile })
      const filteredSteps = getStepsForTier(actualTier)
      setSteps(filteredSteps)
      methods.reset({
        ...methods.getValues(),
        tier: actualTier,
      })
      setIsInitialized(true)
    }
  }, [isInitialized, actualTier, methods, isProfileChecked])

  // Update steps when tier changes (after initial load)
  useEffect(() => {
    if (isInitialized) {
      console.log('Updating steps for tier change:', { actualTier, hasProfile })
      const filteredSteps = getStepsForTier(actualTier)
      setSteps(filteredSteps)
      methods.reset({
        ...methods.getValues(),
        tier: actualTier,
      })
    }
  }, [actualTier, isInitialized, methods])

  const maxSteps = steps.length
  const canGoNext = currentStep < maxSteps - 1
  const canGoPrevious = currentStep > 0

  const goToNextStep = () => {
    if (canGoNext) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (canGoPrevious) {
      setCurrentStep(currentStep - 1)
    }
  }

  const value = {
    currentStep,
    setCurrentStep,
    steps,
    maxSteps: steps.length,
    canGoNext,
    canGoPrevious,
    goToNextStep,
    goToPreviousStep,
    formMethods: methods,
    actualTier,
    isLoading,
    hasProfile,
  }

  // Don't render children until we have both auth and blockchain data
  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-4'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-github-accent-fg mb-2'></div>
          <p className='text-github-fg-default'>Loading profile data...</p>
        </div>
      </div>
    )
  }

  // If a profile exists, don't show the creation flow
  if (hasProfile) {
    return (
      <div className='flex items-center justify-center p-4'>
        <div className='text-center'>
          <p className='text-github-fg-default'>
            You already have a profile. Please wait while we load it...
          </p>
        </div>
      </div>
    )
  }

  return <ProfileStepContext.Provider value={value}>{children}</ProfileStepContext.Provider>
}

export function useProfileStep() {
  const context = useContext(ProfileStepContext)
  if (context === undefined) {
    throw new Error('useProfileStep must be used within a ProfileStepProvider')
  }
  return context
}

export function useProfileForm() {
  const context = useContext(ProfileStepContext)
  if (context === undefined) {
    throw new Error('useProfileForm must be used within a ProfileStepProvider')
  }
  return context.formMethods
}
