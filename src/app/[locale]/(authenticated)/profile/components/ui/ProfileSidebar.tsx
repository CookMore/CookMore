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

  const canAccessStep = useCallback(
    (step: Step) => {
      if (!mounted || isLoading) return false

      switch (step.tier) {
        case ProfileTier.FREE:
          return true
        case ProfileTier.PRO:
          return hasPro || hasGroup || hasOG
        case ProfileTier.GROUP:
          return hasGroup
        case ProfileTier.OG:
          return hasOG
        default:
          return false
      }
    },
    [mounted, isLoading, hasPro, hasGroup, hasOG]
  )

  const handleStepClick = (index: number) => {
    if (canAccessStep(steps[index])) {
      setCurrentStep(index)
    }
  }

  if (!mounted) return null

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r border-github-border-default bg-github-canvas-default transition-all duration-200',
        isExpanded ? 'w-64' : 'w-16'
      )}
    >
      <div className='flex items-center justify-between border-b border-github-border-default p-4'>
        <h2
          className={cn(
            'text-sm font-medium text-github-fg-default transition-opacity',
            !isExpanded && 'opacity-0'
          )}
        >
          {t('navigation')}
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='rounded-lg p-2 text-github-fg-muted hover:bg-github-canvas-subtle'
        >
          <IconChevronLeft
            className={cn('h-4 w-4 transition-transform', !isExpanded && 'rotate-180')}
          />
        </button>
      </div>

      <nav className='flex-1 space-y-1 p-2'>
        {steps.map((step, index) => {
          const isAccessible = canAccessStep(step)
          const isActive = currentStep === index

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              disabled={!isAccessible}
              className={cn(
                'flex w-full items-center space-x-3 rounded-lg p-3 text-left transition-colors',
                isActive
                  ? 'bg-github-canvas-subtle text-github-fg-default'
                  : 'text-github-fg-muted hover:bg-github-canvas-subtle',
                !isAccessible && 'cursor-not-allowed opacity-50'
              )}
            >
              <div className='relative flex-shrink-0'>
                <step.icon className='h-5 w-5' />
                {!isAccessible && (
                  <div className='absolute -right-1 -top-1 rounded-full bg-github-canvas-default p-0.5'>
                    <IconLock className='h-3 w-3 text-github-fg-muted' />
                  </div>
                )}
              </div>
              {isExpanded && (
                <div className='min-w-0 flex-1'>
                  <div className='text-sm font-medium'>{step.label}</div>
                  {step.description && (
                    <div className='mt-1 text-xs text-github-fg-muted'>{step.description}</div>
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
  )
}
