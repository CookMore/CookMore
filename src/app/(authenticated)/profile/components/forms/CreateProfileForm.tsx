'use client'

import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useNFTTiers } from '@/lib/web3/hooks/useNFTTiers'
import { useProfileSystem } from '@/lib/web3/hooks/useProfileSystem'
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

interface CreateProfileFormProps {
  tier: ProfileTier
  currentStep: number
}

export function CreateProfileForm({ tier, currentStep }: CreateProfileFormProps) {
  const t = useTranslations('profile')
  const { hasGroup, hasPro, isLoading: tiersLoading } = useNFTTiers()
  const { createProfile, isLoading: profileLoading } = useProfileSystem()
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
      const result = await createProfile(data)
      if (result.success) {
        toast.success(t('success.profileCreated'))
      }
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error(error instanceof Error ? error.message : t('errors.createFailed'))
    }
  }

  if (tiersLoading || profileLoading) {
    return <FormSkeleton />
  }

  const renderStep = () => {
    const step = steps[currentStep]
    if (!step) return null

    const sectionProps = {
      control,
      errors,
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

  return (
    <form id='create-profile-form' onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
      {renderStep()}
    </form>
  )
}
