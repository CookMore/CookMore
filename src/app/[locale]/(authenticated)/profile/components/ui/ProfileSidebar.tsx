'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/app/api/utils/utils'
import { useTheme } from '@/app/api/providers/core/ThemeProvider'
import type { Step } from '../../steps'
import { ProfileTier } from '../../profile'

interface ProfileSidebarProps {
  steps: Step[]
  currentStep: number
  setCurrentStep: (step: number) => void
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
  const t = useTranslations()
  const { theme } = useTheme()

  console.log('Rendering ProfileSidebar:', {
    stepsCount: steps.length,
    currentStep,
    tier: ProfileTier[tier],
    isExpanded,
    steps: steps.map((s) => ({ id: s.id, tier: ProfileTier[s.tier] })),
  })

  const handleStepClick = (index: number) => {
    console.log('Step clicked:', {
      index,
      stepId: steps[index].id,
      stepTier: ProfileTier[steps[index].tier],
    })
    setCurrentStep(index)
  }

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out',
        isExpanded ? 'w-64' : 'w-16',
        'shrink-0 border-r border-github-border-default'
      )}
    >
      <div className='sticky top-0 p-4'>
        <div className='flex items-center justify-between mb-4'>
          <h2
            className={cn(
              'font-medium transition-opacity duration-300',
              isExpanded ? 'opacity-100' : 'opacity-0'
            )}
          >
            {t('profile.navigation')}
          </h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='p-2 hover:bg-github-canvas-subtle rounded-md'
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? (
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
                />
              </svg>
            ) : (
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 5l7 7-7 7M5 5l7 7-7 7'
                />
              </svg>
            )}
          </button>
        </div>

        <div className='space-y-2'>
          {steps.map((step, index) => {
            console.log('Rendering step button:', {
              index,
              stepId: step.id,
              stepTier: ProfileTier[step.tier],
              isCurrentStep: index === currentStep,
            })

            const StepIcon = step.icon

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                className={cn(
                  'flex items-center w-full p-2 rounded-md transition-all',
                  'hover:bg-github-canvas-subtle',
                  index === currentStep && 'bg-github-canvas-subtle',
                  theme === 'neo' && ['neo-border', 'hover:-translate-y-[2px]', 'hover:neo-shadow']
                )}
                aria-current={index === currentStep ? 'step' : undefined}
              >
                <StepIcon className='w-5 h-5 shrink-0' />
                {isExpanded && (
                  <div className='ml-3 text-left'>
                    <div className='text-sm font-medium'>{step.label}</div>
                    {step.description && (
                      <div className='text-xs text-github-fg-muted'>{step.description}</div>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
