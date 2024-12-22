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
import { useState, Dispatch, SetStateAction } from 'react'
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

  const [isExpanded, setIsExpanded] = useState(true)
  const currentStepData = availableSteps[currentStep]

  if (!currentStepData) {
    return null
  }

  const renderSection = () => {
    const commonProps = { theme, control, errors }

    switch (currentStepData.id) {
      // Basic sections
      case 'basic-info':
        return <BasicInfoSection {...commonProps} />
      case 'culinary-info':
        return <CulinaryInfoSection {...commonProps} />
      case 'social-links':
        return <SocialLinksSection {...commonProps} />

      // Pro sections
      case 'experience':
        return <ExperienceSection {...commonProps} />
      case 'certifications':
        return <CertificationsSection {...commonProps} />
      case 'availability':
        return <AvailabilitySection {...commonProps} />

      // Group sections
      case 'organization-info':
        return <OrganizationInfoSection {...commonProps} />
      case 'business-operations':
        return <BusinessOperationsSection {...commonProps} />
      case 'team':
        return <TeamSection {...commonProps} />
      case 'compliance':
        return <ComplianceSection {...commonProps} tier={currentTier as unknown as ProfileTier} />

      // OG sections
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
        mobileHeader={
          <div className='flex-1'>
            <h1 className='text-lg font-semibold'>
              {t('createProfile')} - {t(`tier.${currentTier}`)}
            </h1>
          </div>
        }
        leftSidebar={
          <ProfileSidebar
            steps={availableSteps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep as Dispatch<SetStateAction<number>>}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            tier={currentTier as unknown as ProfileTier}
          />
        }
        className='w-full px-2 md:px-4'
      >
        <div className='w-full'>
          <div className='bg-github-canvas-subtle border border-github-border-default rounded-lg p-3'>
            <ProfileSessionWarning />
          </div>
          <div className='space-y-4 mt-4'>
            <div className='hidden md:block'>
              <h1 className='text-2xl font-bold text-center'>
                {t('createProfile')} - {t(`tier.${currentTier.toLowerCase()}`)}
              </h1>
            </div>
            <div className='space-y-4'>{renderSection()}</div>
          </div>
        </div>
      </DualSidebarLayout>
    </div>
  )
}
