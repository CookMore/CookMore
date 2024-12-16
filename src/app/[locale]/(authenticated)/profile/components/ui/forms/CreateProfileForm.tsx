'use client'

import React, { useEffect, useCallback, useMemo } from 'react'
import { useFormContext, Control, FieldErrors } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { ProfileTier, type ProfileFormData } from '@/app/[locale]/(authenticated)/profile/profile'
import { toast } from 'sonner'
import { FormSkeleton } from '@/app/api/form/FormSkeleton'
import {
  BasicInfoSection,
  CulinaryInfoSection,
  SocialLinksSection,
  EducationSection,
  ExperienceSection,
  CertificationsSection,
  OrganizationInfoSection,
  BusinessOperationsSection,
} from '../../sections'
import { getStepsForTier } from '../../../steps'
import { useTheme } from '@/app/api/providers/ThemeProvider'
import { useProfile } from '@/app/api/providers/ProfileProvider'

interface CreateProfileFormProps {
  tier: ProfileTier
  currentStep: number
}

interface SectionProps {
  control: Control<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  theme: string
}

export function CreateProfileForm({ tier, currentStep }: CreateProfileFormProps) {
  const t = useTranslations('profile')
  const { theme } = useTheme()
  const { createProfile, currentTier, tiersLoading } = useProfile()
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useFormContext<ProfileFormData>()

  const steps = getStepsForTier(tier)

  const onSubmit = async (data: ProfileFormData) => {
    try {
      toast.loading(t('create.submitting'))
      const hash = await createProfile(data, tier)
      toast.success(t('create.success'))
      return hash
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error(t('create.error'))
      throw error
    }
  }

  // Use useCallback for step rendering to prevent unnecessary re-renders
  const renderStep = useCallback(() => {
    const step = steps[currentStep]
    if (!step) return null

    const sectionProps: SectionProps = {
      control,
      errors,
      theme,
    }

    switch (step.id) {
      case 'basic-info':
        return <BasicInfoSection {...sectionProps} />
      case 'culinary-info':
        return <CulinaryInfoSection {...sectionProps} />
      case 'social-links':
        return <SocialLinksSection {...sectionProps} />
      case 'experience':
        return tier !== ProfileTier.FREE && <ExperienceSection {...sectionProps} />
      case 'certifications':
        return tier !== ProfileTier.FREE && <CertificationsSection {...sectionProps} />
      case 'organization-info':
        return tier === ProfileTier.GROUP && <OrganizationInfoSection {...sectionProps} />
      case 'business-operations':
        return tier === ProfileTier.GROUP && <BusinessOperationsSection {...sectionProps} />
      default:
        return null
    }
  }, [currentStep, control, errors, theme])

  // Verify tier access only once when component mounts or tier changes
  useEffect(() => {
    if (!tiersLoading) {
      if (tier === ProfileTier.GROUP && currentTier !== ProfileTier.GROUP) {
        toast.error(t('errors.needGroupNFT'))
      } else if (tier === ProfileTier.PRO && currentTier === ProfileTier.FREE) {
        toast.error(t('errors.needProNFT'))
      }
    }
  }, [tier, currentTier, tiersLoading, t])

  // Memoize form classes
  const formClasses = useMemo(
    () =>
      `space-y-8 ${
        theme === 'neo'
          ? 'neo-container'
          : theme === 'wooden'
            ? 'wooden-container texture-wood'
            : theme === 'steel'
              ? 'steel-container'
              : theme === 'copper'
                ? 'copper-container shine-effect'
                : 'bg-github-canvas-default'
      }`,
    [theme]
  )

  if (tiersLoading) {
    return <FormSkeleton />
  }

  return (
    <form id='create-profile-form' onSubmit={handleSubmit(onSubmit)} className={formClasses}>
      {renderStep()}
    </form>
  )
}
