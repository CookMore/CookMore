'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile'
import { getStepsForTier, type ProfileStep } from '@/app/[locale]/(authenticated)/profile/steps'

interface ProfileStepContextType {
  currentStep: number
  setCurrentStep: (step: number) => void
  steps: ProfileStep[]
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  actualTier: ProfileTier
  canProgress: boolean
}

const ProfileStepContext = createContext<ProfileStepContextType | undefined>(undefined)

export function ProfileStepProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { hasPro, hasGroup, isLoading } = useNFTTiers()

  // Determine actual tier based on NFT ownership
  const actualTier = hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE
  const steps = getStepsForTier(actualTier)

  // Determine if user can progress based on current step and tier
  const canProgress = true // You can add more complex logic here

  const value = {
    currentStep,
    setCurrentStep,
    steps,
    isCollapsed,
    setIsCollapsed,
    actualTier,
    canProgress,
  }

  // Don't render until NFT status is loaded
  if (isLoading) return null

  return <ProfileStepContext.Provider value={value}>{children}</ProfileStepContext.Provider>
}

export function useProfileStep() {
  const context = useContext(ProfileStepContext)
  if (!context) {
    throw new Error('useProfileStep must be used within a ProfileStepProvider')
  }
  return context
}
