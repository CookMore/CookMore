'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { DualSidebarLayout } from '@/app/api/layouts/DualSidebarLayout'
import { ProfileSidebar } from '../components/ui/ProfileSidebar'
import { CreateProfileForm } from '../components/ui/forms/CreateProfileForm'
import { ProfileTier } from '../profile'
import { steps } from '../steps'
import { FormProvider, useForm } from 'react-hook-form'
import { profileClientService } from '../services/client/profile.service'
import { profileMetadataService } from '../services/client/metadata.service'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/app/api/routes/routes'

interface CreateProfileClientProps {
  initialTier: ProfileTier
  userAddress: string
}

export function CreateProfileClient({ initialTier, userAddress }: CreateProfileClientProps) {
  const t = useTranslations('profile')
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isExpanded, setIsExpanded] = useState(true)

  // Initialize form with metadata based on tier
  const methods = useForm({
    defaultValues: profileMetadataService.createEmptyMetadata(initialTier),
  })

  const onSubmit = async (data: any) => {
    try {
      // Validate metadata
      const validationError = await profileMetadataService.validateMetadata(data)
      if (validationError) {
        toast.error(validationError)
        return
      }

      // Create profile
      const hash = await profileClientService.createProfile(userAddress, data)
      if (hash) {
        toast.success(t('profileCreated'), {
          description: t('redirectingToProfile'),
        })
        router.push(ROUTES.AUTH.PROFILE.ROOT)
      }
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error(t('errorCreatingProfile'), {
        description: error instanceof Error ? error.message : t('pleaseTryAgain'),
      })
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>{t('createProfile')}</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <DualSidebarLayout
            leftSidebar={
              <ProfileSidebar
                steps={steps}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                tier={initialTier}
              />
            }
          >
            <div className='min-h-[60vh]'>
              <CreateProfileForm currentStep={currentStep} tier={initialTier} />
            </div>
          </DualSidebarLayout>
        </form>
      </FormProvider>
    </div>
  )
}
