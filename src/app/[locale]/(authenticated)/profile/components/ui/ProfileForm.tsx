'use client'

import { useFormContext } from 'react-hook-form'
import { useProfile } from '@/hooks/useProfile'
import { motion } from 'framer-motion'
import { TierBadge } from '@/app/[locale]/(authenticated)/profile/components/TierBadge'
import { useState, useEffect } from 'react'
import { ProfileMintModal } from '../modals'
import {
  IconUser,
  IconBook,
  IconChefHat,
  IconGlobe,
  IconBriefcase,
  IconCertificate,
  IconCalendar,
  IconBuildingStore,
  IconUsers,
  IconTruck,
  IconShield,
  IconStore,
  IconGear,
  IconBuilding,
} from '@/components/ui/icons'
import type { ProfileStep } from './steps'
import type {
  ProfileMetadata,
  FreeProfileMetadata,
  ProProfileMetadata,
  GroupProfileMetadata,
} from '@/app/[locale]/(authenticated)/profile/profile'
import BasicInfoSection from './BasicInfoSection'
import EducationSection from './EducationSection'
import CulinaryInfoSection from './CulinaryInfoSection'
import SocialLinksSection from './SocialLinksSection'
import ExperienceSection from './ExperienceSection'
import CertificationsSection from './CertificationsSection'
import AvailabilitySection from './components/AvailabilitySection'
import MarketingSection from './MarketingSection'
import OrganizationInfoSection from './OrganizationInfoSection'
import BusinessOperationsSection from './BusinessOperationsSection'
import TeamSection from './TeamSection'
import SuppliersSection from './SuppliersSection'
import ComplianceSection from './ComplianceSection'
import { cn } from '@/lib/utils/utils'
import ProfilePreview from './ProfilePreview'
import { useProfileForm, shouldShowField } from '@/hooks/useProfileForm'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { useTheme } from '@/app/api/providers/ThemeProvider'
import type { Control, FieldErrors } from 'react-hook-form'
import type { ProfileFormData } from '@/app/[locale]/(authenticated)/profile/profile'
import { useAccount } from 'wagmi'

// Map icons to steps
const stepIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'basic-info': IconUser,
  education: IconBook,
  'culinary-info': IconChefHat,
  'social-links': IconGlobe,
  experience: IconBriefcase,
  certifications: IconCertificate,
  availability: IconCalendar,
  marketing: IconStore,
  'organization-info': IconBuilding,
  'business-operations': IconGear,
  team: IconUsers,
  suppliers: IconTruck,
  compliance: IconShield,
}

interface ProfileFormProps {
  currentStep: number
  onStepChange: (step: number) => void
  onComplete: () => Promise<void>
  steps: readonly ProfileStep[]
}

// Helper type for form data
type ProfileFormData = FreeProfileMetadata | ProProfileMetadata | GroupProfileMetadata

// Add this helper function
const getStepTierInfo = (stepId: string) => {
  const proSteps = ['experience', 'certifications', 'availability', 'marketing']
  const groupSteps = ['organization-info', 'business-operations', 'team', 'suppliers', 'compliance']

  if (groupSteps.includes(stepId)) {
    return {
      tier: 'Group',
      className: 'text-github-success-fg',
    }
  }
  if (proSteps.includes(stepId)) {
    return {
      tier: 'Pro',
      className: 'text-github-accent-fg',
    }
  }
  return {
    tier: 'Free',
    className: 'text-github-fg-muted',
  }
}

// Add type for section props
interface SectionProps {
  control: Control<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  isPro?: boolean
  isGroup?: boolean
}

export function ProfileForm({ currentStep, onStepChange, onComplete, steps }: ProfileFormProps) {
  const { currentTier, isLoading } = useProfile()
  const {
    form: {
      control,
      formState: { errors },
      watch,
      handleSubmit,
    },
    isValid,
  } = useProfileForm(currentTier || ProfileTier.FREE)

  const [isMintModalOpen, setIsMintModalOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Watch form data for preview and mint
  const formData = watch()

  const progress = ((currentStep + 1) / steps.length) * 100
  const StepIcon = stepIcons[steps[currentStep].id] || IconUser

  const { theme } = useTheme()

  const renderStepContent = () => {
    const step = steps[currentStep]
    const sectionProps: SectionProps = {
      control,
      errors,
      isPro: currentTier === ProfileTier.PRO || currentTier === ProfileTier.GROUP,
      isGroup: currentTier === ProfileTier.GROUP,
    }

    if (
      !shouldShowField(
        getStepTierInfo(step.id).tier as ProfileTier,
        currentTier || ProfileTier.FREE
      )
    ) {
      return null
    }

    switch (step.id) {
      case 'basic-info':
        return <BasicInfoSection {...sectionProps} />
      case 'education':
        return <EducationSection {...sectionProps} />
      case 'culinary-info':
        return <CulinaryInfoSection {...sectionProps} />
      case 'social-links':
        return <SocialLinksSection {...sectionProps} />
      case 'experience':
        return sectionProps.isPro ? <ExperienceSection {...sectionProps} /> : null
      case 'certifications':
        return sectionProps.isPro ? <CertificationsSection {...sectionProps} /> : null
      case 'availability':
        return sectionProps.isPro ? <AvailabilitySection {...sectionProps} /> : null
      case 'marketing':
        return sectionProps.isPro ? <MarketingSection {...sectionProps} /> : null
      case 'organization-info':
        return sectionProps.isGroup ? <OrganizationInfoSection {...sectionProps} /> : null
      case 'business-operations':
        return sectionProps.isGroup ? <BusinessOperationsSection {...sectionProps} /> : null
      case 'team':
        return sectionProps.isGroup ? <TeamSection {...sectionProps} /> : null
      case 'suppliers':
        return sectionProps.isGroup ? <SuppliersSection {...sectionProps} /> : null
      case 'compliance':
        return sectionProps.isGroup ? <ComplianceSection {...sectionProps} /> : null
      default:
        return null
    }
  }

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      await onComplete()
      setIsMintModalOpen(true)
    } catch (error) {
      console.error('Error submitting profile:', error)
    }
  })

  return (
    <form onSubmit={handleFormSubmit} className='space-y-6'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-6'>
          {/* Step Info with Icon */}
          <div className='flex items-center gap-3'>
            <div
              className={cn(
                'p-2 rounded-md bg-github-canvas-subtle',
                theme === 'neo' && 'neo-border hover:neo-shadow transition-all'
              )}
            >
              <StepIcon className='w-5 h-5 text-github-fg-default' />
            </div>
            <div className='flex flex-col'>
              <span
                className={cn(
                  'text-sm font-medium text-github-fg-default',
                  theme === 'neo' && 'font-mono tracking-tight'
                )}
              >
                {steps[currentStep].label}
              </span>
              <div className='flex items-center gap-1 text-xs'>
                <span className='text-github-fg-muted'>
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className='text-github-fg-muted'>•</span>
                <span className={getStepTierInfo(steps[currentStep].id).className}>
                  {getStepTierInfo(steps[currentStep].id).tier}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className='flex items-center gap-3'>
            <div
              className={cn(
                'w-32 h-1.5 bg-github-canvas-subtle rounded-full overflow-hidden',
                theme === 'neo' && 'neo-border'
              )}
            >
              <motion.div
                className={cn(
                  'h-full bg-github-accent-emphasis rounded-full',
                  theme === 'neo' && 'neo-shadow'
                )}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </div>

        {/* Tier Badge */}
        {!isLoading && currentTier !== 'Free' && (
          <div className='flex items-center gap-3'>
            <TierBadge tier={currentTier} size='sm' hasProfile={false} />
            <span className='text-sm text-github-fg-muted hidden sm:inline'>{currentTier}</span>
          </div>
        )}
      </div>

      {/* Form Content */}
      <div
        className={cn(
          'space-y-6',
          theme === 'neo' && 'neo-border p-4 hover:neo-shadow transition-all'
        )}
      >
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className='flex justify-between mt-8'>
        <button
          type='button'
          onClick={() => onStepChange(currentStep - 1)}
          disabled={currentStep === 0}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md',
            'transition-all duration-200',
            'border border-github-border-default',
            theme === 'neo' && [
              'neo-border',
              'hover:neo-shadow hover:-translate-y-[2px]',
              'active:translate-y-[1px]',
            ],
            currentStep === 0
              ? 'bg-github-canvas-subtle text-github-fg-muted cursor-not-allowed'
              : 'bg-github-canvas-default text-github-fg-default hover:bg-github-canvas-subtle'
          )}
        >
          Previous
        </button>

        <div className='flex gap-2'>
          <button
            type='button'
            onClick={() => setIsPreviewOpen(true)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md',
              'transition-all duration-200',
              theme === 'neo' && [
                'neo-border',
                'hover:neo-shadow hover:-translate-y-[2px]',
                'active:translate-y-[1px]',
              ],
              'bg-github-canvas-default text-github-fg-default hover:bg-github-canvas-subtle'
            )}
          >
            Preview
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              type='submit'
              disabled={!isValid}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md',
                'transition-all duration-200',
                theme === 'neo' && [
                  'neo-border',
                  'hover:neo-shadow hover:-translate-y-[2px]',
                  'active:translate-y-[1px]',
                ],
                isValid
                  ? 'bg-github-accent-emphasis text-white hover:bg-github-accent-emphasis/90'
                  : 'bg-github-canvas-subtle text-github-fg-muted cursor-not-allowed'
              )}
            >
              Complete
            </button>
          ) : (
            <button
              type='button'
              onClick={() => onStepChange(currentStep + 1)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md',
                'transition-all duration-200',
                theme === 'neo' && [
                  'neo-border',
                  'hover:neo-shadow hover:-translate-y-[2px]',
                  'active:translate-y-[1px]',
                ],
                'bg-github-accent-emphasis text-white hover:bg-github-accent-emphasis/90'
              )}
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <ProfilePreview
          data={formData}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

      {/* Mint Modal */}
      {isMintModalOpen && (
        <ProfileMintModal
          isOpen={isMintModalOpen}
          onClose={() => setIsMintModalOpen(false)}
          data={formData}
        />
      )}
    </form>
  )
}
