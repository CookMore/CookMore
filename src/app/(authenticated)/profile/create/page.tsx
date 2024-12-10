'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DualSidebarLayout } from '@/components/layouts/DualSidebarLayout'
import { ProfileSidebar } from '../components/ui/ProfileSidebar'
import { CreateProfileForm } from '../components/forms/CreateProfileForm'
import { ProfileTier } from '@/types/profile'
import { getStepsForTier } from '../steps'
import { FormProvider, useForm } from 'react-hook-form'

export default function CreateProfilePage() {
  const t = useTranslations('profile')
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [isExpanded, setIsExpanded] = useState(true)

  // Get tier from URL params
  const tierParam = searchParams.get('tier')
  const tier =
    tierParam === 'group'
      ? ProfileTier.GROUP
      : tierParam === 'pro'
        ? ProfileTier.PRO
        : ProfileTier.FREE

  const steps = getStepsForTier(tier)

  const methods = useForm({
    defaultValues: {
      tier,
      version: '1.0',
    },
  })

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>{t('createProfile')}</h1>
      <FormProvider {...methods}>
        <DualSidebarLayout
          leftSidebar={
            <ProfileSidebar
              steps={steps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              tier={tier}
            />
          }
        >
          <CreateProfileForm currentStep={currentStep} tier={tier} />
        </DualSidebarLayout>
      </FormProvider>
    </div>
  )
}
