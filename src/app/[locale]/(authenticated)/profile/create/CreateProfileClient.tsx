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

export function CreateProfileClient() {
  const t = useTranslations('profile')
  const { theme } = useTheme()
  const {
    currentStep,
    setCurrentStep,
    steps: availableSteps,
    actualTier: currentTier,
  } = useProfileStep()

  const {
    control,
    formState: { errors },
  } = useFormContext<ProfileFormData>()

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
        className='w-full px-2 min-[768px]:px-4'
      >
        <div className='w-full pt-2 min-[768px]:pt-0'>
          <div className='bg-github-canvas-subtle border border-github-border-default rounded-lg p-3'>
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
          <div className='space-y-4 mt-4'>
            <h1 className='text-2xl font-bold text-center'>
              {t('createProfile')} - {t(`tier.${currentTier.toLowerCase()}`)}
            </h1>
            <div className='space-y-4'>{renderSection()}</div>
          </div>
        </div>
      </DualSidebarLayout>
    </div>
  )
}
