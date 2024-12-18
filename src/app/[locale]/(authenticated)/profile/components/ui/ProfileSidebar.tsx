'use client'

import { cn } from '@/app/api/utils/utils'
import { IconChevronLeft, IconLock } from '@/app/api/icons'
import { type Step } from '@/app/[locale]/(authenticated)/profile/steps'
import { type Dispatch, type SetStateAction, useEffect, useState, useCallback } from 'react'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { LoadingSpinner } from '@/app/api/loading/LoadingSpinner'
import { useProfile } from '@/app/[locale]/(authenticated)/profile'

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

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show all steps but handle access control through UI
  const canAccessStep = useCallback(
    (step: Step) => {
      switch (tier) {
        case ProfileTier.GROUP:
          return true
        case ProfileTier.PRO:
          return step.tier === ProfileTier.FREE || step.tier === ProfileTier.PRO
        case ProfileTier.FREE:
        default:
          return step.tier === ProfileTier.FREE
      }
    },
    [tier]
  )

  // Don't render until mounted and loaded
  if (!mounted || isLoading) {
    return <LoadingSpinner />
  }

  // Don't render if steps is not available
  if (!steps) {
    return null
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'fixed z-50',
          'p-2 rounded-full',
          'bg-github-canvas-default',
          'border border-github-border-default',
          'shadow-sm',
          'text-github-fg-muted hover:text-github-fg-default',
          'transition-all duration-300 ease-in-out',
          'hover:scale-110',
          'focus:outline-none focus:ring-2',
          'focus:ring-github-accent-emphasis',
          // Positioning
          isExpanded
            ? 'left-[260px]' // When expanded
            : 'left-4', // When collapsed
          'top-20' // Below header
        )}
      >
        <IconChevronLeft className={cn('w-5 h-5', !isExpanded && 'rotate-180')} />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'h-full',
          'bg-github-canvas-default',
          'border-r border-github-border-default',
          'transition-all duration-300 ease-in-out',
          'flex flex-col',
          'z-20',
          // Width handling
          isExpanded ? 'w-[280px]' : 'w-12',
          // Content visibility
          !isExpanded && 'overflow-hidden'
        )}
      >
        {isExpanded ? (
          /* Expanded View */
          <div className='flex-1 p-6 min-h-0 overflow-y-auto'>
            <h2 className='text-xl font-semibold mb-8 text-github-fg-default'>Profile Creation</h2>

            {/* Steps list */}
            <div className='space-y-3'>
              {steps.map((step, index) => {
                const StepIcon = step.icon
                const isComplete = index < currentStep
                const isCurrent = currentStep === index
                const isAccessible = canAccessStep(step)
                const isLocked = !isAccessible

                return (
                  <div
                    key={step.id}
                    className={cn(
                      'relative group rounded-lg transition-all',
                      'hover:bg-github-canvas-subtle',
                      isCurrent && 'bg-github-canvas-subtle'
                    )}
                  >
                    <button
                      onClick={() => isAccessible && setCurrentStep(index)}
                      disabled={isLocked}
                      className={cn(
                        'w-full p-4 text-sm rounded-lg transition-all',
                        'flex items-center gap-4',
                        'focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis',
                        'transform transition-transform duration-200 ease-in-out',
                        isCurrent && [
                          'text-github-fg-default font-medium',
                          'ring-2 ring-github-accent-emphasis',
                        ],
                        !isCurrent && !isComplete && 'text-github-fg-muted',
                        isComplete && 'text-github-fg-default',
                        isLocked && [
                          'opacity-75 cursor-not-allowed',
                          'hover:bg-transparent focus:ring-0',
                        ],
                        // Enhanced hover states
                        !isLocked && [
                          'hover:-translate-y-[1px]',
                          'active:translate-y-[1px]',
                          'hover:shadow-sm',
                        ]
                      )}
                      tabIndex={isLocked ? -1 : 0}
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-sm',
                          'border-2 transition-colors',
                          isCurrent &&
                            'border-github-accent-emphasis bg-github-accent-subtle text-github-accent-emphasis',
                          !isCurrent && !isComplete && 'border-github-border-default',
                          isComplete &&
                            'bg-github-success-emphasis border-github-success-emphasis text-white'
                        )}
                      >
                        {isComplete ? (
                          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
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
                      {StepIcon && <StepIcon className='w-5 h-5' />}
                      <span className='flex-1 text-left font-medium'>{step.label}</span>
                      {isLocked && (
                        <div className='flex items-center gap-2 text-github-fg-muted'>
                          <IconLock className='w-4 h-4' />
                          <span className='text-xs font-medium'>
                            {step.tier === ProfileTier.GROUP ? 'Group' : 'Pro'}
                          </span>
                        </div>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* Retracted View */
          <div className='flex flex-col items-center py-4 space-y-4'>
            {steps.map((step, index) => {
              const isComplete = index < currentStep
              const isCurrent = currentStep === index
              const isAccessible = canAccessStep(step)
              const isLocked = !isAccessible

              return (
                <button
                  key={step.id}
                  onClick={() => isAccessible && setCurrentStep(index)}
                  disabled={isLocked}
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    'transition-all duration-200 ease-in-out',
                    'focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis',
                    !isLocked && [
                      'hover:scale-110 active:scale-95',
                      'hover:bg-github-canvas-subtle',
                      'hover:shadow-sm',
                    ],
                    isCurrent && [
                      'bg-github-accent-subtle text-github-accent-emphasis',
                      'ring-2 ring-github-accent-emphasis',
                    ],
                    !isCurrent && !isComplete && 'text-github-fg-muted',
                    isComplete && 'bg-github-success-emphasis text-white',
                    isLocked && 'opacity-50 cursor-not-allowed'
                  )}
                  title={step.label}
                >
                  {isComplete ? (
                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  ) : (
                    <span className='text-sm font-medium'>{index + 1}</span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </aside>
    </>
  )
}
