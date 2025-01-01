'use client'

import { cn } from '@/app/api/utils/utils'
import { IconChevronLeft, IconLock } from '@/app/api/icons'
import { type Step } from '@/app/[locale]/(authenticated)/profile/steps'
import { type Dispatch, type SetStateAction, useCallback, useState, useEffect } from 'react'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { useProfileContract } from '@/app/[locale]/(authenticated)/profile/components/hooks/contracts/useProfileContract'

const tierColorMap: Record<
  ProfileTier,
  {
    active: string
    hover: string
    text: string
    icon: string
  }
> = {
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
  tier: propTier,
}: ProfileSidebarProps) {
  const t = useTranslations('profile')
  const { isLoading: profileLoading } = useProfile()
  const { currentTier } = useAuth()
  const { isLoading, error, getProfile } = useProfileContract()
  const [hydrated, setHydrated] = useState(false)

  const tier = currentTier || propTier

  // Handle hydration
  useEffect(() => {
    setHydrated(true)
  }, [])

  // Determine which steps are accessible based on tier hierarchy
  const canAccessStep = useCallback(
    (step: Step) => {
      if (!hydrated) return false

      // Always allow access to FREE tier steps
      if (step.tier === ProfileTier.FREE) return true

      switch (tier) {
        case ProfileTier.OG:
          return true
        case ProfileTier.GROUP:
          return [ProfileTier.GROUP, ProfileTier.PRO, ProfileTier.FREE].includes(step.tier)
        case ProfileTier.PRO:
          return [ProfileTier.PRO, ProfileTier.FREE].includes(step.tier)
        default:
          return [ProfileTier.FREE].includes(step.tier)
      }
    },
    [hydrated, tier]
  )

  // Debug logging for hydration and loading states
  useEffect(() => {
    console.log('ProfileSidebar states:', {
      hydrated,
      profileLoading,
      tier,
      currentTier,
      steps: steps.map((s) => ({ id: s.id, tier: s.tier, icon: !!s.icon })),
    })
  }, [hydrated, profileLoading, tier, currentTier, steps])

  const handleStepClick = useCallback(
    (index: number) => {
      if (canAccessStep(steps[index])) {
        setCurrentStep(index)
      }
    },
    [canAccessStep, setCurrentStep, steps]
  )

  const sidebarBaseClasses = cn(
    'fixed left-0 top-16 bottom-0',
    'flex flex-col border-r border-github-border-default',
    'bg-github-canvas-default',
    'transition-all duration-300 ease-in-out',
    'z-[40]',
    isExpanded ? 'w-[280px]' : 'w-[48px]'
  )

  const renderContent = () => {
    if (!hydrated) {
      return null
    }

    const headerContent = (
      <div className='flex items-center justify-between border-b border-github-border-default py-5 px-4'>
        <h2
          className={cn(
            'text-base font-bold text-github-fg-default transition-opacity text-center flex-1 mt-1',
            !isExpanded && 'opacity-0'
          )}
        >
          {t('navigation')}
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'flex items-center justify-center',
            'w-8 h-8 rounded-full',
            'bg-github-canvas-default',
            'border-2 border-github-border-default',
            'hover:bg-github-canvas-subtle transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis focus:ring-offset-2',
            'shadow-[0_2px_4px_rgba(0,0,0,0.1)]',
            'absolute right-0 translate-x-1/2',
            'z-[101]',
            'cursor-pointer'
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

    const navContent = (
      <nav className='flex-1 space-y-2 p-2 overflow-y-auto'>
        {profileLoading || isLoading ? (
          <div>Loading...</div>
        ) : (
          steps.map((step, index) => {
            if (!step.icon) {
              console.error(`No icon found for step: ${step.id}`)
              return null
            }

            const isAccessible = canAccessStep(step)
            const isActive = currentStep === index
            const stepTierColors = tierColorMap[step.tier] || tierColorMap[ProfileTier.FREE]
            const Icon = step.icon

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                disabled={!isAccessible}
                className={cn(
                  'flex w-full items-center rounded-lg p-3 text-left transition-all duration-200 border',
                  isExpanded ? 'space-x-3' : 'justify-center',
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
                  <Icon className={cn('h-5 w-5', isActive ? 'text-white' : stepTierColors.icon)} />
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
          })
        )}
      </nav>
    )

    return (
      <div className={sidebarBaseClasses}>
        {headerContent}
        {navContent}
      </div>
    )
  }

  return renderContent()
}
