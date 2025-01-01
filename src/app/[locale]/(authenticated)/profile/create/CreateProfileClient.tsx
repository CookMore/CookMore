'use client'

import { useTranslations } from 'next-intl'
import { DualSidebarLayout } from '@/app/api/layouts/DualSidebarLayout'
import { ProfileSessionWarning } from '../components/ui/ProfileSessionWarning'
import { type ProfileFormData, ProfileTier } from '../profile'
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
import { useState, useEffect, useRef, useCallback } from 'react'
import { useProfileStep } from '../ProfileStepContext'
import { ProfileSidebar } from '../components/ui/ProfileSidebar'
import { useProfileStorage } from '../components/hooks/core/useProfileStorage'
import { cn } from '@/app/api/utils/utils'
import { ProfileCreationHeader } from '../components/ui/ProfileCreationHeader'
import { ProfilePreview } from '../components/ui/ProfilePreview'
import { MintingStatus } from '../components/ui/MintingStatus'
import { profileMetadataService } from '../services/client/metadata.service'
import { ipfsService } from '../services/ipfs/ipfs.service'
import { toast } from 'sonner'
import type { MintStatus } from '../services/client/contract.service'
import { FormProvider, useForm } from 'react-hook-form'
import { ProfileMint } from '../components/ui/ProfileMint'
import { usePrivy } from '@privy-io/react-auth'
import { getProfile } from '../services/server/profile.service'

export default function CreateProfileClient({ mode }: { mode: 'create' | 'edit' }) {
  const t = useTranslations('profile')
  const { theme } = useTheme()
  const {
    currentStep,
    setCurrentStep,
    steps: availableSteps,
    actualTier: currentTier,
    goToNextStep: nextStep,
    goToPreviousStep: prevStep,
    canGoPrevious: isFirstStep,
    canGoNext: isLastStep,
  } = useProfileStep()

  const methods = useForm<ProfileFormData>()

  useEffect(() => {
    async function fetchData() {
      const data = mode === 'edit' ? await fetchExistingProfileData() : getDefaultValues()
      methods.reset(data)
    }
    fetchData()
  }, [mode, methods])

  const {
    control,
    formState: { errors },
    watch,
  } = methods

  // Storage state
  const { isSaving, lastSaved } = useProfileStorage()

  // All state hooks
  const [isExpanded, setIsExpanded] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [warningState, setWarningState] = useState({
    isExpanded: true,
    isVisible: true,
    showPopover: false,
  })
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [isMintOpen, setIsMintOpen] = useState<boolean>(false)
  const [isMinting, setIsMinting] = useState<boolean>(false)
  const [canMint, setCanMint] = useState<boolean>(false)
  const [mintStatus, setMintStatus] = useState<MintStatus | null>(null)
  const [previewData, setPreviewData] = useState<{
    staticPreview?: File
    dynamicRenderer?: string
  } | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)

  // Refs
  const previewMountedRef = useRef(false)

  // Callbacks
  const handlePreviewReady = useCallback(() => {
    previewMountedRef.current = true
  }, [])

  // Effects
  useEffect(() => {
    setMounted(true)
  }, [])

  // Early return for hydration
  if (!mounted) {
    return null
  }

  const currentStepData = availableSteps[currentStep]
  if (!currentStepData) {
    return null
  }

  // Handle preview generation
  const handlePreviewGeneration = async () => {
    try {
      setIsGeneratingPreview(true)
      profileMetadataService.setProgressCallback((progress) => {
        console.log('Preview generation progress:', progress)
      })

      // First, open the preview modal
      setIsPreviewOpen(true)

      // Wait for the preview to be mounted with longer timeouts
      const waitForPreviewMount = async () => {
        // Initial delay to let the modal open
        await new Promise((resolve) => setTimeout(resolve, 1000))

        for (let i = 0; i < 20; i++) {
          // Increased attempts
          const previewElement = document.getElementById('profile-preview')
          if (previewElement?.dataset.ready === 'true') {
            console.log('Preview element ready')
            await new Promise((resolve) => setTimeout(resolve, 1000))
            return true
          }
          console.log(`Waiting for preview mount... Attempt ${i + 1}/20`)
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
        return false
      }

      const isMounted = await waitForPreviewMount()
      if (!isMounted) {
        setIsPreviewOpen(false)
        throw new Error('Preview failed to mount')
      }

      const formData = watch()
      console.log('Form data for preview:', formData)
      const staticPreview = await profileMetadataService.generateStaticPreview(formData)
      const dynamicRenderer = ipfsService.generateDynamicRenderer(formData)

      const newPreviewData = { staticPreview, dynamicRenderer }
      setPreviewData(newPreviewData)
      return newPreviewData
    } catch (error) {
      console.error('Error generating preview:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to generate preview')
      setIsPreviewOpen(false)
      throw error
    } finally {
      setIsGeneratingPreview(false)
    }
  }

  const renderSection = () => {
    const commonProps = {
      theme,
      control,
      errors,
      onValidationChange: setCanMint, // Add validation callback
    }

    switch (currentStepData.id) {
      case 'basic-info':
        return <BasicInfoSection {...commonProps} onSubmit={handleBasicInfoSubmit} />
      case 'culinary-info':
        return <CulinaryInfoSection {...commonProps} />
      case 'social-links':
        return <SocialLinksSection {...commonProps} />
      case 'experience':
        return <ExperienceSection {...commonProps} />
      case 'certifications':
        return <CertificationsSection {...commonProps} />
      case 'availability':
        return <AvailabilitySection {...commonProps} />
      case 'organization-info':
        return <OrganizationInfoSection {...commonProps} />
      case 'business-operations':
        return <BusinessOperationsSection {...commonProps} />
      case 'team':
        return <TeamSection {...commonProps} />
      case 'compliance':
        return <ComplianceSection {...commonProps} tier={currentTier as unknown as ProfileTier} />
      case 'og-preferences':
        return <OGPreferencesSection {...commonProps} />
      case 'og-showcase':
        return <OGShowcaseSection {...commonProps} />
      case 'og-network':
        return <OGNetworkSection {...commonProps} />
      default:
        return null
    }
  }

  // Define the handler functions
  const handleExpandChange = (expanded: boolean) => {
    setWarningState((prevState) => ({ ...prevState, isExpanded: expanded }))
  }

  const handleVisibilityChange = (visible: boolean) => {
    setWarningState((prevState) => ({ ...prevState, isVisible: visible }))
  }

  const handlePopoverChange = (show: boolean) => {
    setWarningState((prevState) => ({ ...prevState, showPopover: show }))
  }

  const handleBasicInfoSubmit = (data: BasicInfoFormData) => {
    // Handle form submission for basic info
    console.log('Basic Info Submitted:', data)
  }

  return (
    <FormProvider {...methods}>
      <div className='w-full'>
        <DualSidebarLayout
          leftSidebar={
            <ProfileSidebar
              steps={availableSteps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              tier={currentTier as unknown as ProfileTier}
            />
          }
          className='w-full'
        >
          <div className='w-full'>
            <ProfileSessionWarning
              {...warningState}
              onExpandChange={handleExpandChange}
              onVisibilityChange={handleVisibilityChange}
              onPopoverChange={handlePopoverChange}
            />
            <div className='space-y-4 mt-3'>
              <ProfileCreationHeader
                tier={currentTier as unknown as ProfileTier}
                currentStep={currentStep + 1}
                totalSteps={availableSteps.length}
                isSaving={isSaving}
                lastSaved={lastSaved}
                canMint={canMint}
                onShowPreview={() => setIsPreviewOpen(true)}
                onCreateBadge={() => setIsMintOpen(true)}
                isPreviewOpen={isPreviewOpen}
                isMinting={isMinting}
                generationProgress={isGeneratingPreview ? { stage: 'preparing' } : undefined}
              />
              <div className='space-y-4'>{renderSection()}</div>
              <div className='flex justify-between items-center mt-8 pt-4 border-t border-github-border-default'>
                <button
                  onClick={prevStep}
                  disabled={isFirstStep}
                  className={cn(
                    'px-4 py-2 rounded-md border font-medium',
                    'transition-colors duration-200',
                    !isFirstStep
                      ? 'border-github-border-default text-github-fg-default hover:bg-github-canvas-subtle'
                      : 'border-github-border-muted text-github-fg-muted cursor-not-allowed'
                  )}
                >
                  {t('previous')}
                </button>
                <button
                  onClick={nextStep}
                  disabled={isLastStep}
                  className={cn(
                    'px-4 py-2 rounded-md font-medium',
                    'transition-colors duration-200',
                    !isLastStep
                      ? 'bg-github-accent-emphasis text-github-fg-onEmphasis hover:bg-github-accent-muted'
                      : 'bg-github-canvas-subtle text-github-fg-muted cursor-not-allowed'
                  )}
                >
                  {t('next')}
                </button>
              </div>
            </div>
          </div>
        </DualSidebarLayout>

        <ProfilePreview
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          tier={currentTier as unknown as ProfileTier}
          formData={watch()}
        />

        <ProfileMint
          isOpen={isMintOpen}
          onClose={() => {
            setIsMintOpen(false)
            setPreviewData(null)
            previewMountedRef.current = false
          }}
          tier={currentTier as unknown as ProfileTier}
          formData={watch()}
          onComplete={async () => {
            setIsMintOpen(false)
            window.location.href = '/profile'
          }}
          canMint={canMint && !isGeneratingPreview}
        />

        {mintStatus && <MintingStatus status={mintStatus} />}
      </div>
    </FormProvider>
  )
}

// Function to fetch existing profile data for edit mode
async function fetchExistingProfileData(): Promise<ProfileFormData> {
  const { user } = usePrivy()
  const address = user?.walletAddress // Adjust based on how you access the wallet address

  if (!address) {
    throw new Error('User wallet address is not available')
  }

  const profileResponse = await getProfile(address)

  if (!profileResponse.success || !profileResponse.data) {
    throw new Error('Failed to fetch existing profile data')
  }

  const { data } = profileResponse

  return {
    basicInfo: {
      name: data.metadata.name,
      bio: data.metadata.description,
      avatar: data.metadataUri, // Adjust based on your data structure
      banner: '', // Add if applicable
      location: '', // Add if applicable
      social: {
        twitter: '', // Add if applicable
        website: '', // Add if applicable
      },
    },
    socialLinks: {
      twitter: '', // Add if applicable
      website: '', // Add if applicable
    },
    tier: data.tier,
    version: '1.0',
  }
}

// Function to get default values for create mode
function getDefaultValues(): ProfileFormData {
  return {
    basicInfo: {
      name: '',
      bio: '',
      avatar: '',
      banner: '',
      location: '',
      social: {
        twitter: '',
        website: '',
      },
    },
    socialLinks: {
      twitter: '',
      website: '',
    },
    tier: undefined,
    version: '1.0',
  }
}
