'use client'

import { cn } from '@/lib/utils'
import { IconChevronLeft, IconLock } from '@/components/ui/icons'
import { type Step } from '@/app/(authenticated)/profile/steps'
import { type Dispatch, type SetStateAction } from 'react'
import { ProfileTier } from '@/types/profile'
import { useNFTTiers } from '@/lib/web3/hooks/useNFTTiers'

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
  const { hasGroup, hasPro } = useNFTTiers()

  const canAccessStep = (stepIndex: number) => {
    const stepCount = {
      [ProfileTier.FREE]: 3,
      [ProfileTier.PRO]: 6,
      [ProfileTier.GROUP]: 9,
    }

    if (tier === ProfileTier.GROUP && hasGroup) return true
    if (tier === ProfileTier.PRO && (hasPro || hasGroup)) return true
    if (tier === ProfileTier.FREE) return stepIndex < stepCount[ProfileTier.FREE]

    return false
  }

  if (!steps) {
    return (
      <aside
        className={cn(
          'transition-all duration-300 ease-in-out',
          'bg-github-canvas-default rounded-lg shadow-sm',
          'border border-github-border-default',
          'flex-shrink-0',
          isExpanded ? 'w-64 md:w-72' : 'w-16'
        )}
      >
        <div className='flex items-center justify-center h-full'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-github-success-emphasis'></div>
        </div>
      </aside>
    )
  }

  return (
    <aside
      className={cn(
        'transition-all duration-300 ease-in-out',
        'bg-github-canvas-default rounded-lg shadow-sm',
        'border border-github-border-default',
        'flex-shrink-0',
        'relative',
        'lg:relative lg:translate-x-0',
        'fixed inset-y-0 left-0',
        'z-[100]',
        'transform transition-transform duration-300',
        isExpanded ? 'translate-x-0' : '-translate-x-full',
        isExpanded ? 'w-64 md:w-72' : 'w-16'
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
          {steps.map((step, index) => {
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
