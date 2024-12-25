'use client'

import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Input } from '@/app/api/components/ui/input'
import { Textarea } from '@/app/api/components/ui/textarea'
import { FormControl } from '@/app/api/form/FormControl'
import { FormField } from '@/app/api/form/FormField'
import { useIPFSUpload } from '../hooks/ipfs/useIPFS'
import AvatarUploadPopover from '../ui/AvatarUploadPopover'
import { BannerContainer } from '../ui/BannerContainer'
import { baseProfileSchema } from '../../validations/schemas'
import type { Theme } from '@/app/api/providers/core/ThemeProvider'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { useAccount } from 'wagmi'
import { ipfsService } from '../../services/ipfs/ipfs.service'
import { useProfileStorage } from '@/app/[locale]/(authenticated)/profile/components/hooks/core/useProfileStorage'
import { cn } from '@/app/api/utils/utils'
import { Button } from '@/app/api/components/ui/button'
import { IconEye } from '@tabler/icons-react'
import { ProfilePreview } from '../ui/ProfilePreview'

interface BasicInfoFormData {
  name: string
  bio: string
  avatar?: string
  banner?: string
  location?: string
  social?: {
    twitter?: string
    website?: string
  }
}

interface BasicInfoSectionProps {
  defaultValues?: Partial<BasicInfoFormData>
  onSubmit: (data: BasicInfoFormData) => void
  isLoading?: boolean
  theme?: Theme
}

export function BasicInfoSection({
  defaultValues,
  onSubmit,
  isLoading,
  theme = 'dark' as Theme,
}: BasicInfoSectionProps) {
  const t = useTranslations('profile.basicInfo')
  const { address } = useAccount()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BasicInfoFormData>({
    defaultValues,
    resolver: zodResolver(baseProfileSchema),
  })

  const {
    isUploading,
    uploadProgress,
    error: uploadError,
    uploadAvatar,
    uploadBanner,
  } = useIPFSUpload()
  const [avatarError, setAvatarError] = useState<Error | null>(null)
  const [bannerError, setBannerError] = useState<Error | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const { hasGroup, hasPro, hasOG } = useNFTTiers()
  const { saveDraft, loadDraft } = useProfileStorage()
  const [isInitialized, setIsInitialized] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Determine current tier
  const currentTier = useMemo(() => {
    console.log('Determining tier:', { hasOG, hasGroup, hasPro })
    // Force immediate tier calculation
    let tier = ProfileTier.FREE
    if (hasGroup) tier = ProfileTier.GROUP
    if (hasPro) tier = ProfileTier.PRO
    if (hasOG) tier = ProfileTier.OG
    console.log('Selected tier:', { tier, tierType: typeof tier, tierValue: Number(tier) })
    return Number(tier) as ProfileTier
  }, [hasOG, hasGroup, hasPro])

  // Load draft data when component mounts
  useEffect(() => {
    const initializeForm = async () => {
      try {
        const draft = await loadDraft()
        if (draft?.formData) {
          // Update form with draft data
          Object.entries(draft.formData).forEach(([key, value]) => {
            if (value !== undefined) {
              setValue(key as keyof BasicInfoFormData, value)
            }
          })
        }
      } catch (error) {
        console.error('Error loading draft:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    if (!isInitialized) {
      initializeForm()
    }
  }, [loadDraft, setValue, isInitialized])

  // Watch the avatar and banner values
  const avatarCID = watch('avatar')
  const bannerCID = watch('banner')

  // Save draft whenever form values change
  useEffect(() => {
    if (!isInitialized) return // Don't save until initial load is complete

    const subscription = watch((formData) => {
      // Ensure we're saving the complete form data including images
      const completeFormData = {
        ...formData,
        avatar: formData.avatar || avatarCID, // Preserve avatar if it exists
        banner: formData.banner || bannerCID, // Preserve banner if it exists
      }
      console.log('Form data changed, saving draft:', completeFormData)
      saveDraft(completeFormData, currentTier, 0).catch(console.error)
    })
    return () => subscription.unsubscribe()
  }, [watch, currentTier, saveDraft, isInitialized, avatarCID, bannerCID])

  const getImageUrl = (cid?: string) => {
    console.log('BasicInfoSection - getImageUrl input:', { cid })
    if (!cid) {
      console.log('BasicInfoSection - No CID provided, returning null')
      return null
    }
    const url = ipfsService.getHttpUrl(cid)
    console.log('BasicInfoSection - getImageUrl result:', {
      input: cid,
      output: url,
      isIpfs: cid.startsWith('ipfs://'),
      isHttp: cid.startsWith('http'),
    })
    return url
  }

  const handleAvatarUpload = useCallback(
    async (file: File) => {
      console.log('BasicInfoSection - Starting avatar upload:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      })
      setAvatarError(null)
      setIsUploadingAvatar(true)
      try {
        const cid = await uploadAvatar(file)
        console.log('BasicInfoSection - Upload complete:', { cid })
        setValue('avatar', cid)
        console.log('BasicInfoSection - Form value set:', {
          fieldName: 'avatar',
          value: cid,
        })
        // Save draft immediately after successful upload
        const formData = watch()
        const updatedFormData = {
          ...formData,
          avatar: cid,
        }
        await saveDraft(updatedFormData, currentTier, 0)
        return cid
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to upload avatar')
        setAvatarError(error)
        toast.error(error.message)
        console.error('BasicInfoSection - Upload error:', error)
        return null
      } finally {
        setIsUploadingAvatar(false)
      }
    },
    [uploadAvatar, setValue, watch, currentTier, saveDraft]
  )

  const handleBannerUpload = useCallback(
    async (file: File) => {
      setBannerError(null)
      setIsUploadingBanner(true)
      try {
        const cid = await uploadBanner(file)
        const bannerUrl = `ipfs://${cid}`
        setValue('banner', bannerUrl)
        // Save draft immediately after successful upload
        const formData = watch()
        const updatedFormData = {
          ...formData,
          banner: bannerUrl,
        }
        await saveDraft(updatedFormData, currentTier, 0)
        return bannerUrl
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to upload banner')
        setBannerError(error)
        toast.error(error.message)
        return null
      } finally {
        setIsUploadingBanner(false)
      }
    },
    [uploadBanner, setValue, watch, currentTier, saveDraft]
  )

  // Apply theme-specific styles
  const sectionClasses = `space-y-6 ${
    theme === 'neo'
      ? 'neo-section p-6'
      : theme === 'wooden'
        ? 'wooden-section texture-wood p-6'
        : theme === 'steel'
          ? 'steel-section p-6'
          : theme === 'copper'
            ? 'copper-section shine-effect p-6'
            : 'bg-github-canvas-subtle p-6 rounded-lg'
  }`

  const fieldClasses = `space-y-2 ${
    theme === 'neo'
      ? 'neo-field'
      : theme === 'wooden'
        ? 'wooden-field'
        : theme === 'steel'
          ? 'steel-field'
          : theme === 'copper'
            ? 'copper-field'
            : 'bg-github-canvas-default rounded-lg p-4'
  }`

  // Check if required fields are filled for minting
  const { requiredFields, canMint } = useMemo(() => {
    // Watch specific fields for live updates
    const name = watch('name')
    const bio = watch('bio')
    const avatar = watch('avatar')

    const required = {
      name: Boolean(name?.trim()),
      bio: Boolean(bio?.trim()),
      avatar: Boolean(avatar),
    }

    console.log('Mint availability check:', {
      required,
      name,
      bio,
      avatar,
      currentTier,
    })

    return {
      requiredFields: required,
      canMint: Object.values(required).every(Boolean),
    }
  }, [watch, currentTier])

  // Handle form submission with canMint
  const handleFormSubmit = useCallback(
    (data: BasicInfoFormData) => {
      onSubmit({
        ...data,
        bio: data.bio || '', // Ensure bio is never undefined
      })
    },
    [onSubmit]
  )

  return (
    <div className={sectionClasses}>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h2 className='text-lg font-medium'>{t('title')}</h2>
          <p className='text-sm text-gray-500'>{t('description')}</p>
        </div>
        <Button
          variant='secondary'
          onClick={() => setIsPreviewOpen(true)}
          className='flex items-center gap-2'
        >
          <IconEye className='w-4 h-4' />
          Preview
        </Button>
      </div>

      {/* Requirements Summary */}
      <div className='mb-6 p-4 rounded-lg border border-github-border-default bg-github-canvas-subtle'>
        <h3 className='text-sm font-medium mb-2'>Required for Minting</h3>
        <ul className='space-y-1'>
          <li className='flex items-center text-sm'>
            <span
              className={cn(
                'mr-2',
                requiredFields.name ? 'text-github-success-fg' : 'text-github-danger-fg'
              )}
            >
              {requiredFields.name ? '✓' : '•'}
            </span>
            <span className={cn(!requiredFields.name && 'text-github-danger-fg')}>Name</span>
          </li>
          <li className='flex items-center text-sm'>
            <span
              className={cn(
                'mr-2',
                requiredFields.bio ? 'text-github-success-fg' : 'text-github-danger-fg'
              )}
            >
              {requiredFields.bio ? '✓' : '•'}
            </span>
            <span className={cn(!requiredFields.bio && 'text-github-danger-fg')}>Bio</span>
          </li>
          <li className='flex items-center text-sm'>
            <span
              className={cn(
                'mr-2',
                requiredFields.avatar ? 'text-github-success-fg' : 'text-github-danger-fg'
              )}
            >
              {requiredFields.avatar ? '✓' : '•'}
            </span>
            <span className={cn(!requiredFields.avatar && 'text-github-danger-fg')}>
              Profile Picture
            </span>
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
        <div className='relative'>
          <BannerContainer
            imageUrl={getImageUrl(bannerCID)}
            onImageSelect={handleBannerUpload}
            loading={isUploadingBanner}
            error={bannerError?.message}
            uploadProgress={isUploadingBanner ? uploadProgress : null}
            theme={theme as 'neo' | 'wooden' | 'steel' | 'copper' | 'default'}
          />
          <div className='absolute -bottom-14 left-8 z-20'>
            <AvatarUploadPopover
              avatarUrl={getImageUrl(avatarCID)}
              onUpload={handleAvatarUpload}
              onRemove={() => setValue('avatar', undefined)}
              isUploading={isUploadingAvatar}
              uploadProgress={isUploadingAvatar ? uploadProgress : null}
              error={avatarError}
              address={address}
              size={128}
              required={true}
            />
          </div>
        </div>

        {/* Add spacing to account for overlapping avatar */}
        <div className='h-16'></div>

        <div className={fieldClasses}>
          <FormControl
            control={control}
            name='name'
            render={({ field }) => (
              <FormField
                label={t('name.label')}
                required
                error={errors.name?.message}
                description='Required for minting'
              >
                <Input
                  id='name'
                  placeholder={t('name.placeholder')}
                  {...field}
                  disabled={isLoading}
                  className={cn(!requiredFields.name && 'border-github-danger-emphasis')}
                />
              </FormField>
            )}
          />
        </div>

        <div className={fieldClasses}>
          <FormControl
            control={control}
            name='bio'
            render={({ field }) => (
              <FormField
                label={t('bio.label')}
                required
                error={errors.bio?.message}
                description='Required for minting'
              >
                <Textarea
                  id='bio'
                  placeholder={t('bio.placeholder')}
                  {...field}
                  disabled={isLoading}
                  className={cn(!requiredFields.bio && 'border-github-danger-emphasis')}
                />
              </FormField>
            )}
          />
        </div>

        <div className={fieldClasses}>
          <FormControl
            control={control}
            name='location'
            render={({ field }) => (
              <FormField label={t('location.label')} error={errors.location?.message}>
                <Input
                  id='location'
                  placeholder={t('location.placeholder')}
                  {...field}
                  disabled={isLoading}
                />
              </FormField>
            )}
          />
        </div>

        <div className={fieldClasses}>
          <FormControl
            control={control}
            name='social.website'
            render={({ field }) => (
              <FormField label={t('social.website.label')} error={errors.social?.website?.message}>
                <Input
                  id='social.website'
                  placeholder={t('social.website.placeholder')}
                  {...field}
                  disabled={isLoading}
                />
              </FormField>
            )}
          />
        </div>

        <div className={fieldClasses}>
          <FormControl
            control={control}
            name='social.twitter'
            render={({ field }) => (
              <FormField label={t('social.twitter.label')} error={errors.social?.twitter?.message}>
                <Input
                  id='social.twitter'
                  placeholder={t('social.twitter.placeholder')}
                  {...field}
                  disabled={isLoading}
                />
              </FormField>
            )}
          />
        </div>
      </form>

      {/* Preview Modal */}
      <ProfilePreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        tier={currentTier}
        formData={watch()}
      />
    </div>
  )
}
