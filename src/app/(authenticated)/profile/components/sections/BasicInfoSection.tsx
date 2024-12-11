'use client'

import { Control, FieldErrors } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FormField } from '@/components/ui/form'
import type { ProfileMetadata } from '@/types/profile'
import { useTranslations } from 'next-intl'
import { type Theme } from '@/app/providers/ThemeProvider'
import { profileSchema } from '@/lib/validations/profile'

interface BasicInfoSectionProps {
  control: Control<ProfileMetadata>
  errors: FieldErrors<ProfileMetadata>
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

  return (
    <div className={sectionClasses}>
      <div className={fieldClasses}>
        <Label htmlFor='name' required>
          {t('name.label')}
        </Label>
        <FormField
          control={control}
          name='name'
          rules={{
            required: t('name.required'),
            minLength: {
              value: 2,
              message: t('name.tooShort'),
            },
            maxLength: {
              value: 50,
              message: t('name.tooLong'),
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
