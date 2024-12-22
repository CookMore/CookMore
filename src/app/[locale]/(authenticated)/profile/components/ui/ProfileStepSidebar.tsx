'use client'

import { cn } from '@/app/api/utils/utils'
import { type Step } from '@/app/[locale]/(authenticated)/profile/steps'
import { useTranslations } from 'next-intl'
import { tierColorMap } from '../../constants/constants'

interface ProfileStepSidebarProps {
  steps: Step[]
  currentStep: number
  setCurrentStep: (step: number) => void
  currentTier: string
  renderIcon: (icon: any, isActive: boolean, colors: any) => React.ReactNode
}

export function ProfileStepSidebar({
  steps,
  currentStep,
  setCurrentStep,
  currentTier,
  renderIcon,
}: ProfileStepSidebarProps) {
  const t = useTranslations('profile')

  return (
    <div className='space-y-1'>
      {steps.map((step, index) => {
        const isActive = currentStep === index
        const tierColors = tierColorMap[currentTier.toLowerCase() as keyof typeof tierColorMap]

        return (
          <button
            key={step.id}
            type='button'
            onClick={() => setCurrentStep(index)}
            className={cn(
              'flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-200',
              'border bg-github-canvas-default',
              isActive
                ? tierColors.active
                : cn(
                    'border-github-border-default',
                    tierColors.hover,
                    'hover:bg-github-canvas-subtle'
                  )
            )}
          >
            {renderIcon(step.icon, isActive, tierColors)}
            <div className='text-left'>
              <div
                className={cn(
                  'font-medium',
                  isActive ? 'text-white' : 'text-github-fg-default',
                  !isActive && tierColors.hover
                )}
              >
                {step.label}
              </div>
              {step.description && (
                <div className={cn('text-sm', isActive ? 'text-white/80' : 'text-github-fg-muted')}>
                  {step.description}
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
