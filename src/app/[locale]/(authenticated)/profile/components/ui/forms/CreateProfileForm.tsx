'use client'

import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslations } from 'next-intl'
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
import { useProfile } from '../../hooks'
import type { ProfileFormData, ProfileTier } from '../../../profile'

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
  const { createProfile, validateMetadata, isLoading, hasPro, hasGroup } = useProfile()
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useFormContext<ProfileFormData>()

  const steps = getStepsForTier(tier)
  const formData = watch()

  // Verify tier access
  useEffect(() => {
    if (!isLoading) {
      if (tier === ProfileTier.GROUP && !hasGroup) {
        toast.error(t('errors.needGroupNFT'))
      } else if (tier === ProfileTier.PRO && !hasPro) {
        toast.error(t('errors.needProNFT'))
      }
    }
  }, [tier, hasPro, hasGroup, isLoading, t])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Validate metadata before submission
      const isValid = await validateMetadata(data)
      if (!isValid) {
        toast.error(t('create.validationError'))
        return
      }

      toast.loading(t('create.submitting'))
      const hash = await createProfile(data)
      toast.success(t('create.success'))
      return hash
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error(t('create.error'))
      throw error
    }
  }

  const renderStep = () => {
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
  }

  if (isLoading) {
    return <FormSkeleton />
  }

  return (
    <form
      id='create-profile-form'
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-8 ${
        theme === 'neo'
          ? 'neo-container'
          : theme === 'wooden'
            ? 'wooden-container texture-wood'
            : theme === 'steel'
              ? 'steel-container'
              : theme === 'copper'
                ? 'copper-container shine-effect'
                : 'bg-github-canvas-default'
      }`}
    >
      {renderStep()}
    </form>
  )
}
