'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/app/api/components/ui/input'
import { Textarea } from '@/app/api/components/ui/textarea'
import { Label } from '@/app/api/components/ui/label'
import type { ProfileFormData } from '@/app/[locale]/(authenticated)/profile/profile'
import { useTranslations } from 'next-intl'
import { type Theme } from '@/app/api/providers/core/ThemeProvider'
import { useProfileStep } from '../../ProfileStepContext'
import { cn } from '@/app/api/utils/utils'

const tierColorMap = {
  free: {
    active: 'bg-github-success-emphasis text-white border-github-success-emphasis',
    hover: 'hover:border-github-success-emphasis hover:text-github-success-emphasis',
    text: 'text-github-success-fg',
    icon: 'text-github-success-emphasis',
    bg: 'bg-github-success-subtle',
    border: 'border-github-success-muted',
  },
  pro: {
    active: 'bg-github-sponsors-emphasis text-white border-github-sponsors-emphasis',
    hover: 'hover:border-github-sponsors-emphasis hover:text-github-sponsors-emphasis',
    text: 'text-github-sponsors-fg',
    icon: 'text-github-sponsors-emphasis',
    bg: 'bg-github-sponsors-subtle',
    border: 'border-github-sponsors-muted',
  },
  group: {
    active: 'bg-github-done-emphasis text-white border-github-done-emphasis',
    hover: 'hover:border-github-done-emphasis hover:text-github-done-emphasis',
    text: 'text-github-done-fg',
    icon: 'text-github-done-emphasis',
    bg: 'bg-github-done-subtle',
    border: 'border-github-done-muted',
  },
  og: {
    active: 'bg-github-open-emphasis text-white border-github-open-emphasis',
    hover: 'hover:border-github-open-emphasis hover:text-github-open-emphasis',
    text: 'text-github-open-fg',
    icon: 'text-github-open-emphasis',
    bg: 'bg-github-open-subtle',
    border: 'border-github-open-muted',
  },
}

interface BasicInfoSectionProps {
  theme: Theme
}

export function BasicInfoSection({ theme }: BasicInfoSectionProps) {
  const t = useTranslations('profile.basicInfo')
  const { actualTier } = useProfileStep()
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProfileFormData>()

  // Watch form values
  const name = watch('name')
  const bio = watch('bio')
  const description = watch('description')
  const location = watch('location')

  const handleChange =
    (field: keyof ProfileFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(field, e.target.value, { shouldValidate: true })
    }

  const tierColors = tierColorMap[actualTier.toLowerCase()]

  const sectionClasses = cn(
    'space-y-6 p-6 rounded-lg border transition-all duration-200',
    tierColors.bg,
    tierColors.border
  )

  const fieldClasses = cn(
    'space-y-2 p-4 rounded-lg bg-github-canvas-default border transition-all duration-200',
    tierColors.hover
  )

  return (
    <div className={sectionClasses}>
      <div className={fieldClasses}>
        <Label htmlFor='name'>
          {t('name.label')} <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='name'
          value={name}
          onChange={handleChange('name')}
          placeholder={t('name.placeholder')}
          error={errors.name?.message}
        />
      </div>

      <div className={fieldClasses}>
        <Label htmlFor='bio'>{t('bio.label')}</Label>
        <Textarea
          id='bio'
          value={bio}
          onChange={handleChange('bio')}
          placeholder={t('bio.placeholder')}
          error={errors.bio?.message}
        />
      </div>

      <div className={fieldClasses}>
        <Label htmlFor='description'>{t('description.label')}</Label>
        <Textarea
          id='description'
          value={description}
          onChange={handleChange('description')}
          placeholder={t('description.placeholder')}
          error={errors.description?.message}
        />
      </div>

      <div className={fieldClasses}>
        <Label htmlFor='location'>{t('location.label')}</Label>
        <Input
          id='location'
          value={location}
          onChange={handleChange('location')}
          placeholder={t('location.placeholder')}
          error={errors.location?.message}
        />
      </div>

      {/* Debug section */}
      {process.env.NODE_ENV === 'development' && (
        <div className='mt-4 p-4 bg-yellow-50 rounded-lg'>
          <p className='text-sm font-mono'>Form Values:</p>
          <pre className='text-xs mt-2'>
            {JSON.stringify(
              {
                name,
                bio,
                description,
                location,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  )
}
