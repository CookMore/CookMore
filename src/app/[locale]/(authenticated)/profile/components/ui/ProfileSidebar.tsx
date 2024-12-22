'use client'

import { cn } from '@/app/api/utils/utils'
import { IconChevronLeft, IconLock } from '@/app/api/icons'
import { type Step } from '@/app/[locale]/(authenticated)/profile/steps'
import { type Dispatch, type SetStateAction, useEffect, useState, useCallback } from 'react'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { LoadingSpinner } from '@/app/api/loading/LoadingSpinner'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks'
import { useTranslations } from 'next-intl'

const tierColorMap = {
  [ProfileTier.FREE]: {
    active: 'bg-github-accent-emphasis text-github-fg-onEmphasis border-github-accent-emphasis',
    hover:
      'hover:border-github-accent-emphasis hover:text-github-accent-fg hover:bg-github-accent-muted',
    text: 'text-github-accent-fg',
    icon: 'text-github-accent-emphasis',
  },
  [ProfileTier.PRO]: {
    active: 'bg-github-success-emphasis text-github-fg-onEmphasis border-github-success-emphasis',
    hover:
      'hover:border-github-success-emphasis hover:text-github-success-fg hover:bg-github-success-muted',
    text: 'text-github-success-fg',
    icon: 'text-github-success-emphasis',
  },
  [ProfileTier.GROUP]: {
    active:
      'bg-github-attention-emphasis text-github-fg-onEmphasis border-github-attention-emphasis',
    hover:
      'hover:border-github-attention-emphasis hover:text-github-attention-fg hover:bg-github-attention-muted',
    text: 'text-github-attention-fg',
    icon: 'text-github-attention-emphasis',
  },
  [ProfileTier.OG]: {
    active: 'bg-github-danger-emphasis text-github-fg-onEmphasis border-github-danger-emphasis',
    hover:
      'hover:border-github-danger-emphasis hover:text-github-danger-fg hover:bg-github-danger-muted',
    text: 'text-github-danger-fg',
    icon: 'text-github-danger-emphasis',
  },
}

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
  const t = useTranslations('profile')
  const { hasGroup, hasPro, hasOG, isLoading: nftLoading } = useNFTTiers()
  const { isLoading: profileLoading } = useProfile()
  const [mounted, setMounted] = useState(false)

  const isLoading = nftLoading || profileLoading

  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine which steps are accessible based on tier hierarchy
  const canAccessStep = useCallback(
    (step: Step) => {
      if (!mounted || isLoading) return false

      // OG tier has access to everything
      if (hasOG) return true

      // Group tier has access to Group, Pro, and Free steps
      if (hasGroup) {
        return [ProfileTier.GROUP, ProfileTier.PRO, ProfileTier.FREE].includes(step.tier)
      }

      // Pro tier has access to Pro and Free steps
      if (hasPro) {
        return [ProfileTier.PRO, ProfileTier.FREE].includes(step.tier)
      }

      // Free tier only has access to Free steps
      return step.tier === ProfileTier.FREE
    },
    [mounted, isLoading, hasOG, hasGroup, hasPro]
  )

  const handleStepClick = (index: number) => {
    if (canAccessStep(steps[index])) {
      setCurrentStep(index)
    }
  }

  if (!mounted) return null

  const tierColors = tierColorMap[tier]

  return (
    <div className='relative isolate'>
      <div
        className={cn(
          'flex h-full flex-col border-r border-github-border-default bg-github-canvas-default transition-all duration-200',
          isExpanded ? 'w-64' : 'w-16'
        )}
      >
        <div className='flex items-center justify-center border-b border-github-border-default py-5 px-4'>
          <h2
            className={cn(
              'text-base font-bold text-github-fg-default transition-opacity text-center flex-1 mt-1',
              !isExpanded && 'opacity-0'
            )}
          >
            {t('navigation')}
          </h2>
        </div>

        <nav className='flex-1 space-y-2 p-2'>
          {steps.map((step, index) => {
            const isAccessible = canAccessStep(step)
            const isActive = currentStep === index
            const stepTierColors = tierColorMap[step.tier]

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                disabled={!isAccessible}
                className={cn(
                  'flex w-full items-center space-x-3 rounded-lg p-3 text-left transition-all duration-200 border',
                  isActive
                    ? stepTierColors.active
                    : cn(
                        'bg-github-canvas-default border-github-border-default',
                        stepTierColors.hover,
                        'hover:bg-github-canvas-subtle'
                      ),
                  !isAccessible && 'cursor-not-allowed opacity-50'
                )}
              >
                <div className='relative flex-shrink-0'>
                  <step.icon
                    className={cn('h-5 w-5', isActive ? 'text-white' : stepTierColors.icon)}
                  />
                  {!isAccessible && (
                    <div className='absolute -right-1 -top-1 rounded-full bg-github-canvas-default p-0.5'>
                      <IconLock className='h-3 w-3 text-github-fg-muted' />
                    </div>
                  )}
                </div>
                {isExpanded && (
                  <div className='min-w-0 flex-1'>
                    <div
                      className={cn(
                        'text-sm font-medium transition-colors',
                        isActive ? 'text-white' : stepTierColors.text
                      )}
                    >
                      {step.label}
                    </div>
                    {step.description && (
                      <div
                        className={cn(
                          'mt-1 text-xs transition-colors',
                          isActive ? 'text-white/80' : 'text-github-fg-muted'
                        )}
                      >
                        {step.description}
                      </div>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </nav>

        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-github-canvas-default/50'>
            <LoadingSpinner />
          </div>
        )}
      </div>

      {/* Always visible retraction toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'absolute right-2 top-6 z-50',
          'flex items-center justify-center',
          'w-8 h-8 rounded-full',
          'bg-github-canvas-default',
          'border-2 border-github-border-default',
          'hover:bg-github-canvas-subtle transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis focus:ring-offset-2',
          'shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
        )}
        aria-label={isExpanded ? 'Retract sidebar' : 'Expand sidebar'}
      >
        <IconChevronLeft
          className={cn(
            'h-5 w-5 text-github-fg-default',
            'transition-transform duration-200',
            !isExpanded && 'rotate-180'
          )}
        />
      </button>
    </div>
  )
}
