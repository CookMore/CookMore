'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ROUTES } from '@/app/api/routes/routes'
import { useProfileComplete } from './actions'
import { ProfileTier } from '../profile'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { DualSidebarLayout } from '@/app/api/layouts/DualSidebarLayout'
import { getStepsForTier } from '../steps'
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
import { getTierValidation } from '../validations/profile'
import type { ProfileFormData } from '@/app/[locale]/(authenticated)/profile/profile'
import { usePrivy } from '@privy-io/react-auth'

export function CreateProfileClient() {
  console.log('4. Starting CreateProfileClient render')

  // Move ALL hooks to the top
  const t = useTranslations('profile')
  const { user } = usePrivy()
  const { hasGroup, hasPro, hasOG, isLoading } = useNFTTiers()
  const onComplete = useProfileComplete()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  const { theme } = useTheme()

  // Calculate current tier
  const currentTier = useMemo(() => {
    if (hasOG) return ProfileTier.OG
    if (hasGroup) return ProfileTier.GROUP
    if (hasPro) return ProfileTier.PRO
    return ProfileTier.FREE
  }, [hasOG, hasGroup, hasPro])

  // Get steps based on tier
  const availableSteps = useMemo(() => {
    return getStepsForTier(currentTier)
  }, [currentTier])

  // Get validation schema based on tier
  const validationSchema = getTierValidation(currentTier)

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      bio: '',
      avatar: '',
      culinaryInfo: {
        expertise: 'beginner',
        specialties: [],
        certifications: [],
      },
      ...(hasPro && {
        experience: {
          current: {
            title: '',
            company: '',
            startDate: '',
          },
          history: [],
        },
        availability: {
          forHire: false,
          consulting: false,
          collaborations: false,
          teaching: false,
        },
      }),
      ...(hasGroup && {
        organizationInfo: {
          type: 'restaurant',
          establishedYear: new Date().getFullYear().toString(),
          size: 'small',
          team: [],
        },
        businessOperations: {
          operatingHours: [],
          serviceTypes: [],
          capacity: {
            seating: 0,
            eventSpace: 0,
            trainingCapacity: 0,
            maxOccupancy: 0,
          },
          services: [],
        },
        team: {
          size: 0,
          roles: [],
          structure: '',
        },
      }),
      ...(hasOG && {
        ogBenefits: {
          joinDate: new Date().toISOString(),
          memberNumber: 0,
          customBranding: {
            primaryColor: '',
            secondaryColor: '',
          },
          apiAccess: {
            enabled: false,
          },
        },
        verificationStatus: {
          verified: false,
        },
      }),
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = methods

  console.log('4a. User from Privy:', user?.id)
  console.log('5. Tier status:', { hasGroup, hasPro, hasOG, isLoading })
  console.log('6. Current tier:', ProfileTier[currentTier])
  console.log('7. Available steps:', availableSteps)

  if (isLoading) {
    console.log('Loading tiers...')
    return <div>Loading...</div>
  }

  if (!theme) {
    console.log('Theme not loaded')
    return <div>Loading theme...</div>
  }

  if (!availableSteps || availableSteps.length === 0) {
    console.log('No steps available')
    return <div>Error: No steps available for your tier</div>
  }

  const handleStepChange = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < availableSteps.length) {
      setCurrentStep(stepIndex)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true)

      const result = await onComplete(data, currentTier)

      if (result.success) {
        toast.success(t('profileCreated'), {
          description: t('redirectingToProfile'),
        })
        router.push(ROUTES.AUTH.PROFILE.HOME)
      } else {
        throw new Error(result.error || 'Failed to create profile')
      }
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error(t('errorCreatingProfile'), {
        description: error instanceof Error ? error.message : t('pleaseTryAgain'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentStepData = availableSteps[currentStep]

  if (!currentStepData) {
    console.log('Current step data not found')
    return <div>Error: Step not found</div>
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>
        {t('createProfile')} - {t(`tier.${ProfileTier[currentTier].toLowerCase()}`)}
      </h1>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DualSidebarLayout
            leftSidebar={
              <div className='space-y-4'>
                {availableSteps.map((step, index) => (
                  <button
                    key={step.id}
                    type='button'
                    onClick={() => handleStepChange(index)}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                      currentStep === index
                        ? 'bg-github-canvas-subtle text-github-fg-default'
                        : 'text-github-fg-muted hover:bg-github-canvas-subtle'
                    }`}
                  >
                    <step.icon className='w-5 h-5' />
                    <div className='text-left'>
                      <div className='font-medium'>{step.label}</div>
                      {step.description && (
                        <div className='text-sm text-github-fg-muted'>{step.description}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            }
          >
            <div className='min-h-[60vh] space-y-6'>
              {/* Basic sections available to all tiers */}
              {currentStepData.id === 'basic-info' && (
                <BasicInfoSection control={control} errors={errors} theme={theme} />
              )}

              {currentStepData.id === 'culinary-info' && (
                <CulinaryInfoSection control={control} errors={errors} theme={theme} />
              )}

              {currentStepData.id === 'social-links' && (
                <SocialLinksSection control={control} errors={errors} theme={theme} />
              )}

              {/* Pro tier sections */}
              {hasPro && currentStepData.id === 'experience' && (
                <ExperienceSection control={control} errors={errors} theme={theme} />
              )}

              {hasPro && currentStepData.id === 'certifications' && (
                <CertificationsSection control={control} errors={errors} theme={theme} />
              )}

              {hasPro && currentStepData.id === 'availability' && (
                <AvailabilitySection control={control} errors={errors} theme={theme} />
              )}

              {/* Group tier sections */}
              {hasGroup && currentStepData.id === 'organization-info' && (
                <OrganizationInfoSection control={control} errors={errors} theme={theme} />
              )}

              {hasGroup && currentStepData.id === 'business-operations' && (
                <BusinessOperationsSection control={control} errors={errors} theme={theme} />
              )}

              {hasGroup && currentStepData.id === 'team' && (
                <TeamSection control={control} errors={errors} theme={theme} />
              )}

              {hasGroup && currentStepData.id === 'compliance' && (
                <ComplianceSection
                  control={control}
                  errors={errors}
                  theme={theme}
                  tier={currentTier}
                />
              )}

              {/* OG tier sections */}
              {hasOG && currentStepData.id === 'og-preferences' && (
                <OGPreferencesSection control={control} errors={errors} theme={theme} />
              )}

              {hasOG && currentStepData.id === 'og-showcase' && (
                <OGShowcaseSection control={control} errors={errors} theme={theme} />
              )}

              {hasOG && currentStepData.id === 'og-network' && (
                <OGNetworkSection control={control} errors={errors} theme={theme} />
              )}

              <div className='flex justify-between pt-6'>
                <button
                  type='button'
                  onClick={() => handleStepChange(currentStep - 1)}
                  disabled={currentStep === 0}
                  className='px-4 py-2 text-sm font-medium rounded-md border border-github-border-default hover:bg-github-canvas-subtle disabled:opacity-50'
                >
                  {t('previous')}
                </button>

                {currentStep === availableSteps.length - 1 ? (
                  <button
                    type='submit'
                    disabled={isSubmitting || !isValid}
                    className='px-4 py-2 text-sm font-medium rounded-md bg-github-accent-emphasis text-white hover:bg-github-accent-emphasis/90 disabled:opacity-50'
                  >
                    {isSubmitting ? t('creating') : t('createProfile')}
                  </button>
                ) : (
                  <button
                    type='button'
                    onClick={() => handleStepChange(currentStep + 1)}
                    className='px-4 py-2 text-sm font-medium rounded-md bg-github-accent-emphasis text-white hover:bg-github-accent-emphasis/90'
                  >
                    {t('next')}
                  </button>
                )}
              </div>
            </div>
          </DualSidebarLayout>
        </form>
      </FormProvider>
    </div>
  )
}
