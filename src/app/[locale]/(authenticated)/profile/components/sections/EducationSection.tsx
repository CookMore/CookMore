'use client'

import { Control, FieldErrors } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { FormSection } from '@/app/api/form/FormSection'
import { FormInput } from '@/app/api/form/FormInput'
import { FormSelect } from '@/app/api/form/FormSelect'
import { IconGraduationCap } from '@/app/api/icons/'
import type { ProfileFormData } from '@/app/[locale]/(authenticated)/profile/profile'

interface EducationSectionProps {
  control: Control<ProfileFormData>
  errors: FieldErrors<{
    education?: Array<{
      status?: string
      institution?: string
      degree?: string
      field?: string
      startYear?: string
      endYear?: string
      location?: string
    }>
  }>
  index: number
}

type EducationStatus = 'completed' | 'inProgress' | 'planned'

const STATUS_OPTIONS: Array<{ value: EducationStatus; label: string }> = [
  { value: 'completed', label: 'form.education.status.completed' },
  { value: 'inProgress', label: 'form.education.status.inProgress' },
  { value: 'planned', label: 'form.education.status.planned' },
]

export function EducationSection({ control, errors, index }: EducationSectionProps) {
  const t = useTranslations()
  const { theme } = useTheme()

  return (
    <FormSection
      icon={<IconGraduationCap />}
      title={t('form.education.title')}
      description={t('form.education.description')}
      theme={theme}
    >
      <div className='space-y-4'>
        <FormSelect
          control={control}
          name={`education.${index}.status`}
          label={t('form.education.status.label')}
          placeholder={t('form.education.status.placeholder')}
          options={STATUS_OPTIONS.map((option) => ({
            value: option.value,
            label: t(option.label),
          }))}
          error={errors.education?.[index]?.status?.message}
          theme={theme}
        />

        <FormInput
          control={control}
          name={`education.${index}.institution`}
          label={t('form.education.institution.label')}
          placeholder={t('form.education.institution.placeholder')}
          error={errors.education?.[index]?.institution?.message}
          theme={theme}
        />

        <div className='grid grid-cols-2 gap-4'>
          <FormInput
            control={control}
            name={`education.${index}.degree`}
            label={t('form.education.degree.label')}
            placeholder={t('form.education.degree.placeholder')}
            error={errors.education?.[index]?.degree?.message}
            theme={theme}
          />

          <FormInput
            control={control}
            name={`education.${index}.field`}
            label={t('form.education.field.label')}
            placeholder={t('form.education.field.placeholder')}
            error={errors.education?.[index]?.field?.message}
            theme={theme}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <FormInput
            control={control}
            name={`education.${index}.startYear`}
            label={t('form.education.startYear.label')}
            placeholder={t('form.education.startYear.placeholder')}
            error={errors.education?.[index]?.startYear?.message}
            theme={theme}
          />

          <FormInput
            control={control}
            name={`education.${index}.endYear`}
            label={t('form.education.endYear.label')}
            placeholder={t('form.education.endYear.placeholder')}
            error={errors.education?.[index]?.endYear?.message}
            theme={theme}
          />
        </div>

        <FormInput
          control={control}
          name={`education.${index}.location`}
          label={t('form.education.location.label')}
          placeholder={t('form.education.location.placeholder')}
          error={errors.education?.[index]?.location?.message}
          theme={theme}
        />
      </div>
    </FormSection>
  )
}
