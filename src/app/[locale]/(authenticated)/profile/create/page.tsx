'use client'

import { useTranslations } from 'next-intl'
import { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { DualSidebarLayout } from '@/app/api/layouts/DualSidebarLayout'
import { ProfileSidebar } from '../components/ui/ProfileSidebar'
import { CreateProfileForm } from '../components/ui/forms/CreateProfileForm'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { steps } from '../steps'
import { FormProvider, useForm } from 'react-hook-form'
import { useNFTTiers } from '@/app/api/web3/tier'
import { LoadingSpinner } from '@/app/api/loading/LoadingSpinner'

export default function CreateProfilePage() {
  const t = useTranslations('profile')
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isExpanded, setIsExpanded] = useState(true)
  const formInitialized = useRef(false)
  const previousTier = useRef<ProfileTier | null>(null)
  const { hasGroup, hasPro, isLoading: nftLoading } = useNFTTiers()

  // Initialize form first, before any conditional returns
  const methods = useForm({
    defaultValues: {
      tier: ProfileTier.FREE,
      version: '1.0',
    },
  })

  // Get tier from URL params
  const tierParam = searchParams.get('tier')

  const tier = useMemo(() => {
    if (nftLoading) return ProfileTier.FREE
    if (hasGroup) return ProfileTier.GROUP
    if (hasPro) return ProfileTier.PRO

    const normalizedParam = tierParam
      ? tierParam.charAt(0).toUpperCase() + tierParam.slice(1).toLowerCase()
      : 'Free'
    return Object.values(ProfileTier).includes(normalizedParam as ProfileTier)
      ? (normalizedParam as ProfileTier)
      : ProfileTier.FREE
  }, [tierParam, hasGroup, hasPro, nftLoading])

  const availableSteps = useMemo(() => steps, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle form initialization and updates
  useEffect(() => {
    const updateForm = async () => {
      if (!formInitialized.current) {
        await methods.reset({
          tier,
          version: '1.0',
        })
        formInitialized.current = true
        previousTier.current = tier
        return
      }

      if (previousTier.current !== tier) {
        await methods.reset({
          tier,
          version: '1.0',
        })
        previousTier.current = tier
      }
    }

    updateForm()
  }, [tier, methods])

  if (!mounted) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <LoadingSpinner className='w-8 h-8' />
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>{t('createProfile')}</h1>
      <FormProvider {...methods}>
        <DualSidebarLayout
          leftSidebar={
            <ProfileSidebar
              steps={availableSteps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              tier={tier}
            />
          }
        >
          <div className='min-h-[60vh]'>
            <CreateProfileForm currentStep={currentStep} tier={tier} />
          </div>
        </DualSidebarLayout>
      </FormProvider>
    </div>
  )
}
