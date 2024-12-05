'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { useNFTTiers } from '@/hooks/useNFTTiers'
import { useProfileComplete } from '../create/actions'
import { ProfileTier } from '@/types/profile'
import type { GroupProfileMetadata } from '@/types/profile'
import { getStepsForTier } from '../steps'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { profileSchema } from '@/lib/validations/profile'
import ProfilePreview from '../ProfilePreview'
import { ProfileSidebar } from '../ProfileSidebar'
import { PageContainer } from '@/components/PageContainer'
import { PanelContainer } from '@/components/panels/PanelContainer'
import { ProfileSessionWarning } from '../ProfileSessionWarning'
import BasicInfoSection from '../BasicInfoSection'
import EducationSection from '../EducationSection'
import CulinaryInfoSection from '../CulinaryInfoSection'
import ExperienceSection from '../ExperienceSection'
import SocialLinksSection from '../SocialLinksSection'
import CertificationsSection from '../CertificationsSection'
import AvailabilitySection from '../AvailabilitySection'
import MarketingSection from '../MarketingSection'
import OrganizationInfoSection from '../OrganizationInfoSection'
import BusinessOperationsSection from '../BusinessOperationsSection'
import TeamSection from '../TeamSection'
import SuppliersSection from '../SuppliersSection'
import ComplianceSection from '../ComplianceSection'
import { cn } from '@/lib/utils/utils'

interface CreateProfileFormProps {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
}

// Map step IDs to components
const stepComponents = {
  'basic-info': BasicInfoSection,
  education: EducationSection,
  'culinary-info': CulinaryInfoSection,
  'social-links': SocialLinksSection,
  experience: ExperienceSection,
  certifications: CertificationsSection,
  availability: AvailabilitySection,
  marketing: MarketingSection,
  'organization-info': OrganizationInfoSection,
  'business-operations': BusinessOperationsSection,
  team: TeamSection,
  suppliers: SuppliersSection,
  compliance: ComplianceSection,
} as const

// Update the empty profile data structure
const emptyProfileData: GroupProfileMetadata & { tier: ProfileTier } = {
  tier: ProfileTier.FREE, // Default to FREE, will be updated based on NFT ownership
  version: '1.2',
  basicInfo: {
    name: '',
    bio: '',
    avatar: '',
    banner: '',
    location: '',
    website: '',
  },
  education: [],
  culinaryInfo: {
    expertise: 'beginner',
    specialties: [],
    dietaryPreferences: [],
    cuisineTypes: [],
    techniques: [],
    equipment: [],
    certifications: [], // Add required certifications array
  },
  socialLinks: {
    twitter: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    youtube: '',
  },
  experience: {
    current: {
      title: '',
      company: '',
      startDate: '',
    },
    history: [],
  },
  certifications: [],
  availability: {
    forHire: false,
    consulting: false,
    collaborations: false,
    teaching: false,
  },
  marketing: {
    brandColors: [],
    tagline: '',
    mediaKit: '',
    pressReleases: [],
    socialMedia: [],
    promotions: [],
  },
  organizationInfo: {
    name: '',
    type: 'restaurant',
    establishedYear: new Date().toISOString().split('T')[0],
    size: 'small' as const,
    team: [],
    branches: [],
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
  },
  team: {
    size: 0,
    roles: [],
    structure: '',
  },
  suppliers: [],
  compliance: {
    certifications: [],
    licenses: [],
    insurance: [],
  },
}

function ProfileFormSkeleton() {
  return (
    <div className={cn('animate-pulse w-full')}>
      {/* Warning Banner Skeleton */}
      <div className='w-full h-24 bg-github-canvas-subtle rounded-lg mb-4' />

      <div className='flex w-full'>
        {/* Sidebar Skeleton */}
        <div className='w-64 shrink-0'>
          <div className='space-y-2 p-4'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='h-10 bg-github-canvas-subtle rounded-md w-full' />
            ))}
          </div>
        </div>

        {/* Form Content Skeleton */}
        <div className='flex-1 ml-64'>
          <div className='max-w-3xl mx-auto py-4 space-y-8'>
            {/* Instructions Skeleton */}
            <div className='h-16 bg-github-canvas-subtle rounded-lg' />

            {/* Form Fields Skeleton */}
            <div className='space-y-6'>
              {/* Banner Skeleton */}
              <div className='w-full h-48 bg-github-canvas-subtle rounded-lg' />

              {/* Avatar Skeleton */}
              <div className='w-24 h-24 bg-github-canvas-subtle rounded-full -mt-12 ml-4 border-4 border-github-canvas-default' />

              {/* Form Fields */}
              <div className='space-y-4 mt-8'>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className='space-y-2'>
                    <div className='h-4 bg-github-canvas-subtle rounded w-24' />
                    <div className='h-10 bg-github-canvas-subtle rounded-md' />
                  </div>
                ))}
              </div>

              {/* Navigation Buttons Skeleton */}
              <div className='flex justify-between pt-6 mt-8 border-t border-github-border-default'>
                <div className='w-24 h-10 bg-github-canvas-subtle rounded-md' />
                <div className='flex space-x-4'>
                  <div className='w-24 h-10 bg-github-canvas-subtle rounded-md' />
                  <div className='w-24 h-10 bg-github-canvas-subtle rounded-md' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CreateProfileForm({ isExpanded, setIsExpanded }: CreateProfileFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { handleProfileComplete } = useProfileComplete()
  const { ready, authenticated, user } = usePrivy()
  const { currentTier, isLoading: tiersLoading, hasPro, hasGroup } = useNFTTiers()
  const router = useRouter()
  const { toast } = useToast()

  // Initialize form
  const methods = useForm<GroupProfileMetadata & { tier: ProfileTier }>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: emptyProfileData,
    shouldUnregister: false,
  })

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods

  // Handle hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render anything until mounted
  if (!isMounted || !ready || tiersLoading) {
    return (
      <div className='w-full'>
        <ProfileFormSkeleton />
      </div>
    )
  }

  const handleFormSubmit = async (data: GroupProfileMetadata) => {
    try {
      setIsSubmitting(true)
      await handleProfileComplete(data, actualTier)
      toast({
        title: 'Profile created successfully!',
        description: 'Redirecting to your profile...',
      })
      router.push('/profile')
    } catch (error) {
      console.error('Error creating profile:', error)
      toast({
        title: 'Error creating profile',
        description: 'Please try again later',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Determine actual tier based on NFT ownership
  const actualTier = hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={cn('w-full')}>
        <PageContainer>
          <div className='mb-4 px-4 sm:px-6 lg:px-8'>
            <ProfileSessionWarning />
          </div>

          <PanelContainer>
            <div className='relative flex w-full'>
              <div className='absolute left-0 top-0 h-full'>
                <ProfileSidebar
                  steps={getStepsForTier(actualTier)}
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                  isExpanded={isExpanded}
                  setIsExpanded={setIsExpanded}
                />
              </div>

              <div className='flex-1'>
                <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
                  <div className='bg-github-canvas-subtle rounded-lg p-4 mb-6 text-sm text-github-fg-muted'>
                    Add your basic profile information. Fields marked with an asterisk (*) are
                    required and will be stored on-chain.
                  </div>

                  {(() => {
                    const steps = getStepsForTier(actualTier)
                    const currentStepId = steps[currentStep]?.id
                    const StepComponent = currentStepId
                      ? stepComponents[currentStepId as keyof typeof stepComponents]
                      : null

                    if (!StepComponent) return null

                    return (
                      <StepComponent
                        control={control}
                        errors={errors}
                        isPro={hasPro || hasGroup}
                        isGroup={hasGroup}
                      />
                    )
                  })()}

                  <div className='flex justify-between pt-6 mt-8 border-t border-github-border-default'>
                    <Button
                      type='button'
                      variant='outline'
                      className={cn(
                        'transition-all',
                        isSubmitting && 'opacity-50 cursor-not-allowed'
                      )}
                      onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                      disabled={currentStep === 0 || isSubmitting}
                    >
                      Previous
                    </Button>

                    <div className='flex space-x-4'>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => setIsPreviewOpen(true)}
                        disabled={isSubmitting}
                      >
                        Preview
                      </Button>

                      {currentStep === getStepsForTier(actualTier).length - 1 ? (
                        <Button type='submit' disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <LoadingSpinner className={cn('w-4 h-4 mr-2')} />
                              Creating Profile...
                            </>
                          ) : (
                            'Create Profile'
                          )}
                        </Button>
                      ) : (
                        <Button
                          type='button'
                          onClick={() =>
                            setCurrentStep((prev) =>
                              Math.min(getStepsForTier(actualTier).length - 1, prev + 1)
                            )
                          }
                          disabled={isSubmitting}
                        >
                          Next
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PanelContainer>
        </PageContainer>

        {isPreviewOpen && (
          <ProfilePreview
            profile={watch()}
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
          />
        )}
      </form>
    </FormProvider>
  )
}
