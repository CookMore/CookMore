'use client'

import { cn } from '@/app/api/utils/utils'
import { IconChevronLeft, IconLock } from '@/app/api/icons'
import { type Step } from '@/app/[locale]/(authenticated)/profile/steps'
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { LoadingSpinner } from '@/app/api/loading/LoadingSpinner'
import { useProfileSystem } from '@/app/[locale]/(authenticated)/profile/components/hooks'

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
  const { isLoading: profileLoading } = useProfileSystem()
  const [mounted, setMounted] = useState(false)

  const isLoading = nftLoading || profileLoading

  useEffect(() => {
    setMounted(true)
  }, [])

  // Debug logging
  useEffect(() => {
    console.log('Sidebar State:', {
      hasGroup,
      hasPro,
      isLoading,
      mounted,
      providedTier: tier,
      effectiveTier: hasGroup ? 'GROUP' : hasPro ? 'PRO' : 'FREE',
      steps: steps.length,
    })
  }, [hasGroup, hasPro, isLoading, mounted, tier, steps.length])

  const effectiveTier = useMemo(() => {
    if (!mounted || isLoading) return tier

    // NFT ownership takes precedence over URL tier
    if (hasGroup) return ProfileTier.GROUP
    if (hasPro) return ProfileTier.PRO

    // If no NFTs, respect the URL tier
    return tier
  }, [hasGroup, hasPro, isLoading, mounted, tier])

  const visibleSteps = useMemo(() => {
    console.log('Calculating visible steps:', {
      effectiveTier,
      totalSteps: steps.length,
      providedSteps: steps,
      hasGroup,
      hasPro,
    })

    // NFT ownership determines visible steps
    if (hasGroup) return steps // Show all steps for GROUP NFT holders
    if (hasPro) {
      return steps.filter((step) => step.tier !== ProfileTier.GROUP)
    }

    // Otherwise filter based on URL tier
    return steps.filter((step) => step.tier === ProfileTier.FREE)
  }, [steps, effectiveTier, hasGroup, hasPro])

  const canAccessStep = useCallback(
    (stepIndex: number) => {
      const step = steps[stepIndex]
      if (!step) return false

      // Check if step's tier is accessible with current effective tier
      switch (effectiveTier) {
        case ProfileTier.GROUP:
          return true // Group can access all steps
        case ProfileTier.PRO:
          return step.tier === ProfileTier.FREE || step.tier === ProfileTier.PRO
        case ProfileTier.FREE:
          return step.tier === ProfileTier.FREE
        default:
          return false
      }
    },
    [steps, effectiveTier]
  )

  // Don't render until we have tier info
  if (!mounted || isLoading) {
    return <LoadingSpinner />
  }

  return (
    <aside
      className={cn(
        'transition-all duration-300 ease-in-out',
        'bg-github-canvas-default rounded-lg shadow-sm',
        'border border-github-border-default',
        'flex-shrink-0',
        'relative',
        'lg:sticky lg:top-4 lg:translate-x-0',
        'fixed inset-y-0 left-0',
        'z-[40]',
        'transform transition-transform duration-300',
        isExpanded ? 'translate-x-0' : '-translate-x-full',
        isExpanded ? 'w-64 md:w-72' : 'w-16',
        'max-h-[calc(100vh-2rem)] overflow-y-auto'
      )}
    >
      {isExpanded && (
        <div
          className='fixed inset-0 bg-black/20 lg:hidden z-[-1]'
          onClick={() => setIsExpanded(false)}
        />
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'absolute -right-3 top-4 z-10',
          'p-1.5 rounded-full bg-github-canvas-default',
          'border border-github-border-default shadow-sm',
          'text-github-fg-muted hover:text-github-fg-default',
          'transition-all duration-300 ease-in-out hover:scale-110',
          'focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis focus:ring-offset-2',
          !isExpanded && 'rotate-180'
        )}
      >
        <IconChevronLeft className='w-4 h-4' />
      </button>

      <div className={cn('py-4 px-4', !isExpanded && 'hidden')}>
        <h2 className='text-lg font-semibold mb-6 text-github-fg-default'>Profile Creation</h2>

        <div className='space-y-1'>
          {visibleSteps.map((step, index) => {
            const StepIcon = step.icon
            const isComplete = index < currentStep
            const isCurrent = currentStep === index
            const isAccessible = canAccessStep(index)
            const isLocked = !isAccessible

            return (
              <button
                key={step.id}
                onClick={() => isAccessible && setCurrentStep(index)}
                disabled={isLocked}
                className={cn(
                  'w-full p-2.5 text-sm rounded-md transition-all relative group',
                  'flex items-center gap-3',
                  'focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis',
                  'hover:bg-github-canvas-subtle active:bg-github-canvas-subtle/80',
                  'transform transition-transform duration-200 ease-in-out',
                  'hover:-translate-y-[1px] active:translate-y-[1px]',
                  isCurrent && [
                    'bg-github-canvas-subtle text-github-fg-default font-medium',
                    'ring-2 ring-github-accent-emphasis',
                  ],
                  !isCurrent && !isComplete && 'text-github-fg-muted',
                  isComplete && 'text-github-fg-default',
                  isLocked &&
                    'opacity-50 cursor-not-allowed hover:bg-transparent focus:ring-0 hover:transform-none'
                )}
                tabIndex={isLocked ? -1 : 0}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-xs',
                    'border transition-colors',
                    isCurrent &&
                      'border-github-accent-emphasis bg-github-accent-subtle text-github-accent-emphasis',
                    !isCurrent && !isComplete && 'border-github-border-default',
                    isComplete &&
                      'bg-github-success-emphasis border-github-success-emphasis text-white'
                  )}
                >
                  {isComplete ? (
                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                {step.icon && <StepIcon className='w-4 h-4 mr-2' />}
                <span className='flex-1 text-left'>{step.label}</span>
                {isLocked && <IconLock className='w-4 h-4 text-github-fg-muted' />}
                {isCurrent && (
                  <div className='absolute inset-y-0 left-0 w-1 bg-github-accent-emphasis rounded-l-md' />
                )}
              </button>
            )
          })}
        </div>

        {/* Tier Indicator */}
        <div className='mt-6 pt-4 border-t border-github-border-default'>
          <div className='text-sm font-medium text-github-fg-default mb-2'>Current Tier</div>
          <div
            className={cn(
              'px-3 py-2 rounded-md text-sm',
              'border border-github-border-default',
              'flex items-center justify-between',
              tier === ProfileTier.GROUP
                ? 'bg-purple-50 text-purple-700'
                : tier === ProfileTier.PRO
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-gray-50 text-gray-700'
            )}
          >
            <span>
              {tier === ProfileTier.GROUP ? 'Group' : tier === ProfileTier.PRO ? 'Pro' : 'Free'}
            </span>
            {tier !== ProfileTier.FREE && <span className='text-xs opacity-75'>NFT Active</span>}
          </div>
        </div>
      </div>

      {/* Collapsed state with numbers */}
      {!isExpanded && (
        <div className='py-4 px-1'>
          <div className='space-y-1'>
            {steps.map((_, index) => {
              const isComplete = index < currentStep
              const isCurrent = currentStep === index
              const isAccessible = canAccessStep(index)
              const isLocked = !isAccessible

              return (
                <button
                  key={index}
                  onClick={() => isAccessible && setCurrentStep(index)}
                  disabled={isLocked}
                  className={cn(
                    'w-full h-10 flex items-center justify-center relative',
                    'text-sm font-medium rounded-md transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis',
                    'hover:bg-github-canvas-subtle active:bg-github-canvas-subtle/80',
                    'transform transition-transform duration-200 ease-in-out',
                    'hover:-translate-y-[1px] active:translate-y-[1px]',
                    isCurrent && ['bg-github-canvas-subtle', 'ring-2 ring-github-accent-emphasis'],
                    isLocked &&
                      'opacity-50 cursor-not-allowed hover:bg-transparent focus:ring-0 hover:transform-none'
                  )}
                  tabIndex={isLocked ? -1 : 0}
                >
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                      'border transition-colors',
                      isCurrent &&
                        'border-github-accent-emphasis bg-github-accent-subtle text-github-accent-emphasis',
                      !isCurrent &&
                        !isComplete &&
                        'border-github-border-default text-github-fg-muted',
                      isComplete &&
                        'bg-github-success-emphasis border-github-success-emphasis text-white'
                    )}
                  >
                    {isComplete ? (
                      <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    ) : isLocked ? (
                      <IconLock className='w-3 h-3' />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {isCurrent && (
                    <div className='absolute inset-y-0 left-0 w-1 bg-github-accent-emphasis rounded-l-md' />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </aside>
  )
}
