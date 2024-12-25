'use client'

import { useTranslations } from 'next-intl'
import { DualSidebarLayout } from '@/app/api/layouts/DualSidebarLayout'
import { ProfileSessionWarning } from '../components/ui/ProfileSessionWarning'
import { type ProfileFormData, ProfileTier } from '../profile'
import {
  BasicInfoSection,
  CulinaryInfoSection,
  SocialLinksSection,
  ExperienceSection,
  CertificationsSection,
  AvailabilitySection,
  OrganizationInfoSection,
  BusinessOperationsSection,
  TeamSection,
  ComplianceSection,
  OGPreferencesSection,
  OGShowcaseSection,
  OGNetworkSection,
} from '../components/sections'
import { useTheme } from '@/app/api/providers/core/ThemeProvider'
import { useState, useEffect } from 'react'
import { useProfileStep } from '../ProfileStepContext'
import { useFormContext } from 'react-hook-form'
import { ProfileSidebar } from '../components/ui/ProfileSidebar'
import { useProfileStorage } from '../components/hooks/core/useProfileStorage'
import { cn } from '@/app/api/utils/utils'
import { ProfileCreationHeader } from '../components/ui/ProfileCreationHeader'

export function CreateProfileClient() {
  const t = useTranslations('profile')
  const { theme } = useTheme()
  const {
    currentStep,
    setCurrentStep,
    steps: availableSteps,
    actualTier: currentTier,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
  } = useProfileStep()

  const {
    control,
    formState: { errors },
  } = useFormContext<ProfileFormData>()

  // Storage state
  const { isSaving, lastSaved } = useProfileStorage()

  // Sidebar state
  const [isExpanded, setIsExpanded] = useState(true)

  // Warning state
  const [mounted, setMounted] = useState(false)
  const [warningState, setWarningState] = useState({
    isExpanded: true,
    isVisible: true,
    showPopover: false,
  })

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const currentStepData = availableSteps[currentStep]

  if (!currentStepData || !mounted) {
    return null
  }

  const renderSection = () => {
    const commonProps = { theme, control, errors }

    switch (currentStepData.id) {
      case 'basic-info':
        return <BasicInfoSection {...commonProps} />
      case 'culinary-info':
        return <CulinaryInfoSection {...commonProps} />
      case 'social-links':
        return <SocialLinksSection {...commonProps} />
      case 'experience':
        return <ExperienceSection {...commonProps} />
      case 'certifications':
        return <CertificationsSection {...commonProps} />
      case 'availability':
        return <AvailabilitySection {...commonProps} />
      case 'organization-info':
        return <OrganizationInfoSection {...commonProps} />
      case 'business-operations':
        return <BusinessOperationsSection {...commonProps} />
      case 'team':
        return <TeamSection {...commonProps} />
      case 'compliance':
        return <ComplianceSection {...commonProps} tier={currentTier as unknown as ProfileTier} />
      case 'og-preferences':
        return <OGPreferencesSection {...commonProps} />
      case 'og-showcase':
        return <OGShowcaseSection {...commonProps} />
      case 'og-network':
        return <OGNetworkSection {...commonProps} />
      default:
        return null
    }
  }

  return (
    <div className='w-full'>
      <DualSidebarLayout
        leftSidebar={
          <ProfileSidebar
            steps={availableSteps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            tier={currentTier as unknown as ProfileTier}
          />
        }
        className='w-full'
      >
        <div className='w-full'>
          <div>
            <ProfileSessionWarning
              isExpanded={warningState.isExpanded}
              isVisible={warningState.isVisible}
              showPopover={warningState.showPopover}
              onExpandChange={(expanded) =>
                setWarningState((prev) => ({ ...prev, isExpanded: expanded }))
              }
              onVisibilityChange={(visible) =>
                setWarningState((prev) => ({ ...prev, isVisible: visible }))
              }
              onPopoverChange={(show) =>
                setWarningState((prev) => ({ ...prev, showPopover: show }))
              }
            />
          </div>
          <div className='space-y-4 mt-3'>
            <ProfileCreationHeader
              tier={currentTier as unknown as ProfileTier}
              currentStep={currentStep + 1}
              totalSteps={availableSteps.length}
              isSaving={isSaving}
              lastSaved={lastSaved}
            />
            <div className='space-y-4'>{renderSection()}</div>
            <div className='flex justify-between items-center mt-8 pt-4 border-t border-github-border-default'>
              <button
                onClick={prevStep}
                disabled={isFirstStep}
                className={cn(
                  'px-4 py-2 rounded-md border font-medium',
                  'transition-colors duration-200',
                  !isFirstStep
                    ? 'border-github-border-default text-github-fg-default hover:bg-github-canvas-subtle'
                    : 'border-github-border-muted text-github-fg-muted cursor-not-allowed'
                )}
              >
                {t('previous')}
              </button>
              <button
                onClick={nextStep}
                disabled={isLastStep}
                className={cn(
                  'px-4 py-2 rounded-md font-medium',
                  'transition-colors duration-200',
                  !isLastStep
                    ? 'bg-github-accent-emphasis text-github-fg-onEmphasis hover:bg-github-accent-muted'
                    : 'bg-github-canvas-subtle text-github-fg-muted cursor-not-allowed'
                )}
              >
                {t('next')}
              </button>
            </div>
          </div>
        </div>
      </DualSidebarLayout>
    </div>
  )
}
