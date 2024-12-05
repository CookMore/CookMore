'use client'

import { Control, FieldErrors, useController } from 'react-hook-form'
import { FormInput } from '@/components/ui/form/FormInput'
import { IconUser } from '@/components/ui/icons'
import { AvatarContainer } from '@/app/(authenticated)/profile/AvatarContainer'
import type { FreeProfileMetadata, ProProfileMetadata, GroupProfileMetadata } from '@/types/profile'
import { useState, useEffect, useCallback } from 'react'
import { BannerContainer } from '@/app/(authenticated)/profile/BannerContainer'
import { ipfsService } from '@/lib/services/ipfs-service'
import { toast } from 'sonner'
import { OnChainMetadataSchema } from '@/lib/validations/profile.chain'
import { FormSelect } from '@/components/ui/form/FormSelect'
import { FormSwitch } from '@/components/ui/form/FormSwitch'

type ProfileFormData = FreeProfileMetadata | ProProfileMetadata | GroupProfileMetadata

interface BasicInfoSectionProps {
  control: Control<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  optimisticData?: ProfileFormData
}

interface ImageState {
  previewUrl: string | null
  ipfsUrl: string | null
  isUploading: boolean
}

export default function BasicInfoSection({
  control,
  errors,
  optimisticData,
}: BasicInfoSectionProps) {
  const [bannerPosition, setBannerPosition] = useState({ x: 0, y: 0, scale: 1 })
  const [avatarPosition, setAvatarPosition] = useState({ x: 0, y: 0, scale: 1 })
  const [bannerState, setBannerState] = useState<ImageState>({
    previewUrl: null,
    ipfsUrl: null,
    isUploading: false,
  })
  const [avatarState, setAvatarState] = useState<ImageState>({
    previewUrl: null,
    ipfsUrl: null,
    isUploading: false,
  })

  const { field: bannerField } = useController({ control, name: 'banner' })
  const { field: avatarField } = useController({ control, name: 'avatar' })

  // Memoize URL getters to prevent unnecessary re-renders
  const getBannerUrl = useCallback(() => {
    if (bannerState.previewUrl) return bannerState.previewUrl
    if (bannerState.ipfsUrl) return ipfsService.getIPFSUrl(bannerState.ipfsUrl)
    return bannerField.value
  }, [bannerState.previewUrl, bannerState.ipfsUrl, bannerField.value])

  const getAvatarUrl = useCallback(() => {
    if (avatarState.previewUrl) return avatarState.previewUrl
    if (avatarState.ipfsUrl) return ipfsService.getIPFSUrl(avatarState.ipfsUrl)
    return avatarField.value
  }, [avatarState.previewUrl, avatarState.ipfsUrl, avatarField.value])

  // Handle IPFS uploads
  const handleImageUpload = useCallback(
    async (file: File, type: 'banner' | 'avatar') => {
      const setState = type === 'banner' ? setBannerState : setAvatarState
      const field = type === 'banner' ? bannerField : avatarField

      try {
        // Create and set preview immediately
        const previewUrl = URL.createObjectURL(file)
        setState((prev) => ({
          ...prev,
          previewUrl,
          isUploading: true,
        }))

        // Start IPFS upload in background
        const ipfsUrl = await ipfsService.uploadProfileImage(file)
        console.log(`Uploaded ${type} to IPFS:`, ipfsUrl)

        // Update state and form field
        setState((prev) => ({
          ...prev,
          ipfsUrl,
          isUploading: false,
        }))
        field.onChange(ipfsUrl)
      } catch (error) {
        console.error(`Failed to upload ${type}:`, error)
        toast.error(`Failed to upload ${type}`)
        setState((prev) => ({
          ...prev,
          isUploading: false,
        }))
      }
    },
    [bannerField, avatarField]
  )

  return (
    <div className='space-y-6'>
      {/* Banner and Avatar Section */}
      <div className='relative w-full'>
        <BannerContainer
          imageUrl={getBannerUrl()}
          onImageSelect={(file) => handleImageUpload(file, 'banner')}
          onImagePositionSet={setBannerPosition}
          loading={bannerState.isUploading}
        />

        {/* Profile Avatar */}
        <div className='absolute -bottom-10 left-4'>
          <AvatarContainer
            imageUrl={getAvatarUrl()}
            onImageSelect={(file) => handleImageUpload(file, 'avatar')}
            onImagePositionSet={setAvatarPosition}
            size='base'
            loading={avatarState.isUploading}
            required
            label='Profile Picture'
          />
        </div>
      </div>

      {/* Add spacing to account for avatar overflow */}
      <div className='h-8' />

      {/* Form Fields */}
      <div className='space-y-4'>
        {/* Basic Information */}
        <div className='space-y-4'>
          <FormInput
            control={control}
            name='name'
            label='Name'
            error={errors.name?.message}
            placeholder='Your full name'
            required
          />
          <FormInput
            control={control}
            name='bio'
            label='Bio'
            multiline
            error={errors.bio?.message}
            placeholder='Tell us about yourself (minimum 10 characters)'
            helperText='This description will be stored on-chain and visible to everyone'
            required
          />
          <FormInput
            control={control}
            name='location'
            label='Location'
            error={errors.location?.message}
            placeholder='City, Country'
          />
        </div>

        {/* Preferences */}
        <div className='space-y-6 pt-4 border-t border-github-border-default'>
          <h3 className='text-sm font-medium text-github-fg-default'>Preferences</h3>

          <FormSelect
            control={control}
            name='preferences.theme'
            label='Theme'
            error={errors.preferences?.theme?.message}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'system', label: 'System' },
            ]}
          />

          <div className='space-y-4'>
            <FormSwitch
              control={control}
              name='preferences.notifications'
              label='Enable Notifications'
              error={errors.preferences?.notifications?.message}
              defaultChecked={false}
              helperText='Receive notifications about profile interactions and updates'
            />

            <div className='space-y-2'>
              <FormInput
                control={control}
                name='preferences.email'
                label='Contact Email'
                error={errors.preferences?.email?.message}
                placeholder='your@email.com'
              />
              <FormSwitch
                control={control}
                name='preferences.displayEmail'
                label='Display Email'
                error={errors.preferences?.displayEmail?.message}
                defaultChecked={false}
                helperText='Make your email visible to other users'
              />
            </div>

            <div className='space-y-2'>
              <FormInput
                control={control}
                name='location'
                label='Location'
                error={errors.location?.message}
                placeholder='City, Country'
              />
              <FormSwitch
                control={control}
                name='preferences.displayLocation'
                label='Display Location'
                error={errors.preferences?.displayLocation?.message}
                defaultChecked={false}
                helperText='Make your location visible to other users'
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className='space-y-4 pt-4 border-t border-github-border-default'>
          <h3 className='text-sm font-medium text-github-fg-default'>Social Links</h3>

          <FormInput
            control={control}
            name='social.urls.0'
            label='Website'
            error={errors.social?.urls?.[0]?.message}
            placeholder='https://your-website.com'
          />

          <FormInput
            control={control}
            name='social.labels.0'
            label='Website Label'
            error={errors.social?.labels?.[0]?.message}
            placeholder='Personal Website'
          />
        </div>
      </div>

      {/* Validation Status */}
      {(errors.name || errors.bio || errors.avatar) && (
        <div className='rounded-md bg-github-danger-subtle p-4 border border-github-danger-emphasis mt-6'>
          <p className='text-sm text-github-danger-fg font-medium'>
            Please complete all required on-chain fields before proceeding
          </p>
          <ul className='mt-2 text-sm text-github-danger-fg'>
            {errors.name && <li>• {errors.name.message}</li>}
            {errors.bio && <li>• {errors.bio.message}</li>}
            {errors.avatar && <li>• Profile picture is required</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
