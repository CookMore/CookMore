import { cn } from '@/app/api/utils/utils'
import { IconChevronLeft, IconLock } from '@/app/api/icons'
import { type Step } from '@/app/[locale]/(authenticated)/profile/steps'
import { type Dispatch, type SetStateAction, useEffect, useState, useCallback } from 'react'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { LoadingSpinner } from '@/app/api/loading/LoadingSpinner'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks'

interface ProfileSidebarProps {
  steps: Step[]
  currentStep: number
  setCurrentStep: Dispatch<SetStateAction<number>>
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  tier: ProfileTier
}

export function ProfileSidebar({
  steps,
  currentStep,
  setCurrentStep,
  isExpanded,
  setIsExpanded,
  tier,
}: ProfileSidebarProps) {
  const { hasGroup, hasPro, isLoading: nftLoading } = useNFTTiers()
  const { isLoading: profileLoading } = useProfile()
  const [mounted, setMounted] = useState(false)

  const isLoading = nftLoading || profileLoading

  // ... existing code ...
}
