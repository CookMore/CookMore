'use client'

import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { getStepsForTier, type ProfileStep } from '@/app/[locale]/(authenticated)/profile/steps'
import { profileCacheService } from '@/app/[locale]/(authenticated)/profile/services/offline/profile-cache.service'
import { usePrivy } from '@privy-io/react-auth'
import { type TierStatus } from '../services/server/tier.service'

interface ProfileStepContextType {
  currentStep: number
  setCurrentStep: (step: number) => void
  steps: ProfileStep[]
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  actualTier: ProfileTier
  canProgress: boolean
  error: Error | null
  isLoading: boolean
  refetch: () => Promise<void>
}

const ProfileStepContext = createContext<ProfileStepContextType | undefined>(undefined)

interface ProfileStepProviderProps {
  children: React.ReactNode
  initialTierStatus: TierStatus | null
}

export function ProfileStepProvider({ children, initialTierStatus }: ProfileStepProviderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(!initialTierStatus)
  const [error, setError] = useState<Error | null>(null)
  const [actualTier, setActualTier] = useState<ProfileTier | null>(
    initialTierStatus?.currentTier ?? null
  )
  const { user } = usePrivy()

  const loadTierStatus = async () => {
    try {
      setIsLoading(true)
      const address = user?.wallet?.address
      if (!address) {
        throw new Error('No wallet address found')
      }

      // Get tier status directly from tier cache
      const cachedTier = await profileCacheService.getCachedTierStatus(address)
      if (cachedTier?.status) {
        console.log('Found cached tier status:', cachedTier)
        setActualTier(cachedTier.status.currentTier)
      } else {
        console.log('No cached tier status found')
        setActualTier(null)
      }
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load tier status'))
      console.error('Error loading tier status:', err)
      setActualTier(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Only load from cache if we don't have initial tier status
    if (!initialTierStatus && user?.wallet?.address) {
      loadTierStatus()
    }
  }, [user?.wallet?.address, initialTierStatus])

  const steps = useMemo(() => getStepsForTier(actualTier), [actualTier])
  const canProgress = !error && !isLoading && actualTier !== null

  const value = {
    currentStep,
    setCurrentStep,
    steps,
    isCollapsed,
    setIsCollapsed,
    actualTier: actualTier ?? ProfileTier.FREE,
    canProgress,
    error,
    isLoading,
    refetch: loadTierStatus,
  }

  if (!actualTier) {
    return null // Don't render children until we have a tier
  }

  return <ProfileStepContext.Provider value={value}>{children}</ProfileStepContext.Provider>
}

export const useProfileSteps = () => {
  const context = useContext(ProfileStepContext)
  if (!context) {
    throw new Error('useProfileSteps must be used within a ProfileStepProvider')
  }
  return context
}
