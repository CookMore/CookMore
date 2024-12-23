'use client'

import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Input } from '@/app/api/components/ui/input'
import { Textarea } from '@/app/api/components/ui/textarea'
import { FormControl } from '@/app/api/form/FormControl'
import { FormField } from '@/app/api/form/FormField'
import { useIPFSUpload } from '../hooks/ipfs/useIPFS'
import { AvatarContainer } from '../ui/AvatarContainer'
import { BannerContainer } from '../ui/BannerContainer'
import { baseProfileSchema } from '../../validations/schemas'
import type { Theme } from '@/app/api/providers/core/ThemeProvider'

interface BasicInfoFormData {
  name: string
  bio?: string
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
  theme = 'default',
}: BasicInfoSectionProps) {
  const t = useTranslations('profile.basicInfo')

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BasicInfoFormData>({
    defaultValues,
    resolver: zodResolver(baseProfileSchema),
  })

  const { isUploading, uploadProgress, error, uploadAvatar, uploadBanner } = useIPFSUpload()

  const handleAvatarUpload = useCallback(
    async (file: File) => {
      try {
        const cid = await uploadAvatar(file)
        setValue('avatar', cid)
        return cid
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message)
        }
        return null
      }
    },
    [uploadAvatar, setValue]
  )

  const handleBannerUpload = useCallback(
    async (file: File) => {
      try {
        const cid = await uploadBanner(file)
        setValue('banner', cid)
        return cid
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message)
        }
        return null
      }
    },
    [uploadBanner, setValue]
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

  return (
    <div className={sectionClasses}>
      <h2 className='text-lg font-medium mb-2'>{t('title')}</h2>
      <p className='text-sm text-gray-500 mb-6'>{t('description')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='relative'>
          <BannerContainer
            imageUrl={defaultValues?.banner ? `/api/ipfs/${defaultValues.banner}` : null}
            onImageSelect={handleBannerUpload}
            loading={isUploading}
          />
          <div className='absolute -bottom-16 left-8'>
            <AvatarContainer
              avatarCID={defaultValues?.avatar}
              onUpload={handleAvatarUpload}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              error={error}
            />
          </div>
        </div>

        {/* Add spacing to account for overlapping avatar */}
        <div className='h-20'></div>

        <div className={fieldClasses}>
          <FormControl
            control={control}
            name='name'
            render={({ field }) => (
              <FormField label={t('name.label')} required error={errors.name?.message}>
                <Input
                  id='name'
                  placeholder={t('name.placeholder')}
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
            name='bio'
            render={({ field }) => (
              <FormField label={t('bio.label')} error={errors.bio?.message}>
                <Textarea
                  id='bio'
                  placeholder={t('bio.placeholder')}
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
    </div>
  )
}
