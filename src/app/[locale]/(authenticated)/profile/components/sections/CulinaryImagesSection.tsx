'use client'

import { Control, useController } from 'react-hook-form'
import { FormSection } from '@/app/api/form/FormSection'
import { IconImage } from '@/app/api/icons'
import { AvatarUploadPopover } from '../ui/AvatarUploadPopover'
import { BannerContainer } from '../ui/BannerContainer'
import type { FreeProfileMetadata } from '@/app/[locale]/(authenticated)/profile/profile'
import { useIPFSUpload } from '../hooks/ipfs/useIPFS'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'

interface CulinaryImagesSectionProps {
  control: Control<FreeProfileMetadata>
}

export function CulinaryImagesSection({ control }: CulinaryImagesSectionProps) {
  const { field: avatarField } = useController({
    name: 'avatar',
    control,
  })

  const { field: bannerField } = useController({
    name: 'banner',
    control,
  })

  const { isUploading, uploadProgress, error, uploadAvatar, uploadBanner } = useIPFSUpload()
  const { hasGroup, hasPro, hasOG } = useNFTTiers()

  // Determine current tier
  const currentTier = hasOG
    ? ProfileTier.OG
    : hasGroup
      ? ProfileTier.GROUP
      : hasPro
        ? ProfileTier.PRO
        : ProfileTier.FREE

  const handleAvatarUpload = async (file: File) => {
    try {
      const cid = await uploadAvatar(file)
      avatarField.onChange(`ipfs://${cid}`)
      return `ipfs://${cid}`
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      return null
    }
  }

  const handleBannerUpload = async (file: File) => {
    try {
      const cid = await uploadBanner(file)
      bannerField.onChange(`ipfs://${cid}`)
      return `ipfs://${cid}`
    } catch (error) {
      console.error('Failed to upload banner:', error)
      return null
    }
  }

  return (
    <FormSection
      title='Profile Images'
      description='Upload your profile picture and banner image'
      icon={IconImage}
    >
      <div className='space-y-6'>
        <div className='flex flex-col items-center space-y-4'>
          <AvatarUploadPopover
            avatarUrl={avatarField.value}
            onUpload={handleAvatarUpload}
            onRemove={() => avatarField.onChange(null)}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            error={error}
            tier={currentTier}
          />
          <span className='text-sm text-github-fg-muted'>Profile Picture</span>
        </div>

        <div className='space-y-4'>
          <BannerContainer
            imageUrl={bannerField.value}
            onImageSelect={handleBannerUpload}
            onImageRemove={() => bannerField.onChange(null)}
            loading={isUploading}
            uploadProgress={uploadProgress}
          />
          <span className='text-sm text-github-fg-muted'>Banner Image</span>
        </div>
      </div>
    </FormSection>
  )
}
