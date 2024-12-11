'use client'

import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useNFTTiers } from '@/lib/web3/hooks/features/useNFTTiers'
import { useProfileRegistry } from '@/lib/web3/hooks/contracts/useProfileRegistry'
import { ProfileTier, type ProfileFormData } from '@/types/profile'
import { toast } from 'sonner'
import { FormSkeleton } from '../ui/FormSkeleton'
import {
  BasicInfoSection,
  CulinaryInfoSection,
  SocialLinksSection,
  EducationSection,
  ExperienceSection,
  CertificationsSection,
  OrganizationInfoSection,
  BusinessOperationsSection,
} from '../sections'
import { getStepsForTier } from '../../steps'
import { useTheme } from '@/app/providers/ThemeProvider'

interface CreateProfileFormProps {
  tier: ProfileTier
  currentStep: number
}

export function CreateProfileForm({ tier, currentStep }: CreateProfileFormProps) {
  const t = useTranslations('profile')
  const { theme } = useTheme()
  const { hasGroup, hasPro, isLoading: tiersLoading } = useNFTTiers()
  const { createProfile } = useProfileRegistry()
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useFormContext<ProfileFormData>()

  // Verify tier access
  useEffect(() => {
    if (tier === ProfileTier.GROUP && !hasGroup) {
      toast.error(t('errors.needGroupNFT'))
    } else if (tier === ProfileTier.PRO && !hasPro && !hasGroup) {
      toast.error(t('errors.needProNFT'))
    }
  }, [tier, hasGroup, hasPro, t])

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

  if (tiersLoading) {
    return <FormSkeleton />
  }

  const renderStep = () => {
    const step = steps[currentStep]
    if (!step) return null

    const sectionProps = {
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

  // Apply theme-specific styles
  const formClasses = `space-y-8 ${
    theme === 'neo'
      ? 'neo-container'
      : theme === 'wooden'
        ? 'wooden-container texture-wood'
        : theme === 'steel'
          ? 'steel-container'
          : theme === 'copper'
            ? 'copper-container shine-effect'
            : 'bg-github-canvas-default'
  }`

  return (
    <form id='create-profile-form' onSubmit={handleSubmit(onSubmit)} className={formClasses}>
      {renderStep()}
    </form>
  )
}
