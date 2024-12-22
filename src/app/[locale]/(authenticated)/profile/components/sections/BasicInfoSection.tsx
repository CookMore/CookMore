'use client'

import React from 'react'
import { Control, FieldErrors } from 'react-hook-form'
import { Input } from '@/app/api/components/ui/input'
import { Textarea } from '@/app/api/components/ui/textarea'
import { Label } from '@/app/api/components/ui/label'
import { FormField } from '@/app/api/form/form'
import type { ProfileFormData } from '@/app/[locale]/(authenticated)/profile/profile'
import { useTranslations } from 'next-intl'
import { type Theme } from '@/app/api/providers/core/ThemeProvider'
import { profileSchema } from '@/app/[locale]/(authenticated)/profile/validations/profile'
import { zodResolver } from '@hookform/resolvers/zod'

interface BasicInfoSectionProps {
  control: Control<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  theme: Theme
}

export function BasicInfoSection({ control, errors, theme }: BasicInfoSectionProps) {
  const t = useTranslations('profile.basicInfo')

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

  // Get validation rules from schema
  const nameValidation = profileSchema.shape.name
  const bioValidation = profileSchema.shape.bio

  return (
    <div className={sectionClasses}>
      <div className={fieldClasses}>
        <Label htmlFor='name'>
          {t('name.label')} <span className='text-red-500'>*</span>
        </Label>
        <FormField
          control={control}
          name='name'
          rules={{
            required: t('name.required'),
            validate: async (value) => {
              try {
                await nameValidation.parseAsync(value)
                return true
              } catch (error) {
                return t('name.invalid')
              }
            },
          }}
          render={({ field }) => (
            <Input
              id='name'
              placeholder={t('name.placeholder')}
              error={errors.name?.message}
              {...field}
            />
          )}
        />
      </div>

      <div className={fieldClasses}>
        <Label htmlFor='bio'>{t('bio.label')}</Label>
        <FormField
          control={control}
          name='bio'
          rules={{
            validate: async (value) => {
              try {
                await bioValidation.parseAsync(value)
                return true
              } catch (error) {
                return t('bio.invalid')
              }
            },
          }}
          render={({ field }) => (
            <Textarea
              id='bio'
              placeholder={t('bio.placeholder')}
              error={errors.bio?.message}
              {...field}
            />
          )}
        />
      </div>

      <div className={fieldClasses}>
        <Label htmlFor='location'>{t('location.label')}</Label>
        <FormField
          control={control}
          name='location'
          render={({ field }) => (
            <Input
              id='location'
              placeholder={t('location.placeholder')}
              error={errors.location?.message}
              {...field}
            />
          )}
        />
      </div>

      <div className={fieldClasses}>
        <Label htmlFor='website'>{t('website.label')}</Label>
        <FormField
          control={control}
          name='website'
          render={({ field }) => (
            <Input
              id='website'
              placeholder={t('website.placeholder')}
              error={errors.website?.message}
              {...field}
            />
          )}
        />
      </div>

      <div className={fieldClasses}>
        <Label htmlFor='social.twitter'>{t('social.twitter.label')}</Label>
        <FormField
          control={control}
          name='social.twitter'
          render={({ field }) => (
            <Input
              id='social.twitter'
              placeholder={t('social.twitter.placeholder')}
              error={errors.social?.twitter?.message}
              {...field}
            />
          )}
        />
      </div>
    </div>
  )
}
