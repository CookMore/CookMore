'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ROUTES } from '@/app/api/routes/routes'
import { useProfileComplete } from './actions'
import { ProfileTier } from '../profile'
import { DualSidebarLayout } from '@/app/api/layouts/DualSidebarLayout'
import { getStepsForTier } from '../steps'
import { CreateProfileSkeleton } from '../components/ui/CreateProfileSkeleton'
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
import { ProfileSessionWarning } from '../components/ui/ProfileSessionWarning'
import { ProfileSidebar } from '../components/ui/ProfileSidebar'

// Section mapping object with proper type
const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'basic-info': BasicInfoSection,
  'culinary-info': CulinaryInfoSection,
  'social-links': SocialLinksSection,
  experience: ExperienceSection,
  certifications: CertificationsSection,
  availability: AvailabilitySection,
  'organization-info': OrganizationInfoSection,
  'business-operations': BusinessOperationsSection,
  team: TeamSection,
  compliance: ComplianceSection,
  'og-preferences': OGPreferencesSection,
  'og-showcase': OGShowcaseSection,
  'og-network': OGNetworkSection,
} as const

interface ProfileCompleteResult {
  success: boolean
  error?: string
  hash?: string
}

interface CreateProfileClientProps {
  initialTier: ProfileTier
  tierFlags: {
    hasOG: boolean
    hasGroup: boolean
    hasPro: boolean
  }
}

export function CreateProfileClient({ initialTier, tierFlags }: CreateProfileClientProps) {
  console.log('Rendering CreateProfileClient with tier:', ProfileTier[initialTier])
  const { user } = usePrivy()
  const { theme } = useTheme()
  const t = useTranslations()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isExpanded, setIsExpanded] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { hasOG, hasGroup, hasPro } = tierFlags

  const { handleProfileComplete } = useProfileComplete()

  // Get steps based on tier - only update when tier changes
  const availableSteps = useMemo(() => {
    console.log('Calculating available steps:', {
      currentTier: ProfileTier[initialTier],
      hasOG,
      hasGroup,
      hasPro,
    })

    // Get steps for current tier
    const steps = getStepsForTier(initialTier)
    console.log(
      'Got steps:',
      steps.map((s) => ({ id: s.id, tier: ProfileTier[s.tier] }))
    )
    return steps
  }, [initialTier, hasOG, hasGroup, hasPro])

  // Get validation schema based on tier
  const validationSchema = useMemo(() => {
    return getTierValidation(initialTier)
  }, [initialTier])

  // Ensure we have a valid current step
  useEffect(() => {
    console.log('Checking current step validity:', {
      currentStep,
      availableStepsCount: availableSteps.length,
    })

    if (currentStep >= availableSteps.length) {
      console.log('Current step out of bounds, resetting to 0')
      setCurrentStep(0)
    }
  }, [currentStep, availableSteps.length])

  // Initialize form with all possible fields
  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(validationSchema || z.object({})),
    mode: 'onChange',
    defaultValues: {
      name: '',
      bio: '',
      avatar: '',
      location: '',
      website: '',
      social: {
        twitter: '',
        instagram: '',
        linkedin: '',
      },
      culinaryInfo: {
        expertise: 'beginner',
        specialties: [],
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

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state only during initial load
  if (!mounted) {
    console.log('Showing skeleton - waiting for hydration')
    return <CreateProfileSkeleton />
  }

  // Don't show loading if we already have steps
  if (availableSteps.length === 0) {
    console.log('Showing skeleton - no steps available', {
      currentTier: ProfileTier[initialTier],
      stepsCount: availableSteps.length,
    })
    return <CreateProfileSkeleton />
  }

  const currentStepData = availableSteps[currentStep] || availableSteps[0]
  console.log('Current step:', {
    stepId: currentStepData.id,
    stepTier: ProfileTier[currentStepData.tier],
  })

  const handleNextStep = () => {
    if (currentStep < availableSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true)

      const result = (await handleProfileComplete(data, initialTier)) as ProfileCompleteResult

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

  const renderSection = () => {
    console.log('Rendering section:', {
      currentStepId: currentStepData?.id,
      currentStepTier: currentStepData ? ProfileTier[currentStepData.tier] : 'unknown',
      userTier: ProfileTier[initialTier],
      availableStepsCount: availableSteps.length,
      hasOG,
      hasGroup,
      hasPro,
    })

    const Section = SECTION_COMPONENTS[currentStepData?.id]
    if (!Section) {
      console.warn('No section component found for step:', currentStepData?.id)
      return null
    }

    // Check if user has access to this section based on tier
    const canAccess = (() => {
      switch (currentStepData.tier) {
        case ProfileTier.FREE:
          return true // Free tier is accessible to everyone

        case ProfileTier.PRO:
          return hasPro || hasGroup || hasOG // Pro steps require Pro token or higher

        case ProfileTier.GROUP:
          return hasGroup || hasOG // Group steps require Group token or higher

        case ProfileTier.OG:
          return hasOG // OG steps require OG token

        default:
          return false
      }
    })()

    console.log('Section access check:', {
      stepId: currentStepData.id,
      stepTier: ProfileTier[currentStepData.tier],
      userTier: ProfileTier[initialTier],
      canAccess,
      hasOG,
      hasGroup,
      hasPro,
    })

    if (!canAccess) {
      console.warn('User does not have access to section:', currentStepData.id)
      return null
    }

    return <Section control={control} errors={errors} theme={theme} tier={initialTier} />
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <DualSidebarLayout
        leftSidebar={
          <ProfileSidebar
            steps={availableSteps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            tier={initialTier}
          />
        }
      >
        <div className='space-y-6'>
          <ProfileSessionWarning />
          <h1 className='text-2xl font-bold mb-6 text-center'>
            {t('profile.createProfile')} -{' '}
            {t(`profile.tier.${ProfileTier[initialTier].toLowerCase()}`)}
          </h1>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {renderSection()}
              <div className='flex justify-between pt-6'>
                <button
                  type='button'
                  onClick={handlePreviousStep}
                  disabled={currentStep === 0}
                  className='px-4 py-2 text-sm font-medium rounded-md border border-github-border-default hover:bg-github-canvas-subtle disabled:opacity-50'
                >
                  {t('profile.form.navigation.previous')}
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
                    onClick={handleNextStep}
                    className='px-4 py-2 text-sm font-medium rounded-md bg-github-accent-emphasis text-white hover:bg-github-accent-emphasis/90'
                  >
                    {t('profile.form.navigation.next')}
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </DualSidebarLayout>
    </div>
  )
}
