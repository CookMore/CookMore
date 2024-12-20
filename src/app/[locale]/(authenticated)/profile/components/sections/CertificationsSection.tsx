'use client'

import React from 'react'
import { Control, FieldErrors } from 'react-hook-form'
import { Input } from '@/app/api/components/ui/input'
import { FormField } from '@/app/api/form/form'
import { Label } from '@/app/api/components/ui/label'
import { FormSection } from '@/app/api/form/FormSection'
import { FormArrayField } from '@/app/api/form/FormArrayField'
import { IconCertificate } from '@/app/api//icons'
import type { ProfileFormData } from '@/app/[locale]/(authenticated)/profile/profile'
import { useTranslations } from 'next-intl'
import { type Theme } from '@/app/api/providers/core/ThemeProvider'
import { proProfileSchema } from '@/app/[locale]/(authenticated)/profile/validations/profile'

interface CertificationsSectionProps {
  control: Control<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  theme: Theme
}

// Helper function to create empty certification
const createEmptyCertification = () => ({
  name: '',
  issuer: '',
  date: '',
  expiryDate: '',
  verificationLink: '',
})

export function CertificationsSection({ control, errors, theme }: CertificationsSectionProps) {
  const t = useTranslations('profile.certifications')

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
  const certificationsValidation = proProfileSchema.shape.culinaryInfo.shape.certifications

  return (
    <FormSection icon={IconCertificate} title={t('title')} className={sectionClasses}>
      <div className={fieldClasses}>
        <FormArrayField
          control={control}
          name='culinaryInfo.certifications'
          label={t('label')}
          addButtonText={t('addButton')}
          emptyValue={createEmptyCertification()}
          maxItems={5}
          renderField={(field, index) => (
            <div className='space-y-4'>
              <FormField
                control={control}
                name={`culinaryInfo.certifications.${index}.name`}
                rules={{
                  required: t('name.required'),
                  validate: async (value) => {
                    try {
                      await certificationsValidation.shape.name.parseAsync(value)
                      return true
                    } catch (error) {
                      return t('name.invalid')
                    }
                  },
                }}
                render={({ field }) => (
                  <>
                    <Label htmlFor={`certification-name-${index}`}>{t('name.label')}</Label>
                    <Input
                      id={`certification-name-${index}`}
                      placeholder={t('name.placeholder')}
                      error={errors.culinaryInfo?.certifications?.[index]?.name?.message}
                      {...field}
                    />
                  </>
                )}
              />

              <FormField
                control={control}
                name={`culinaryInfo.certifications.${index}.issuer`}
                rules={{
                  required: t('issuer.required'),
                  validate: async (value) => {
                    try {
                      await certificationsValidation.shape.issuer.parseAsync(value)
                      return true
                    } catch (error) {
                      return t('issuer.invalid')
                    }
                  },
                }}
                render={({ field }) => (
                  <>
                    <Label htmlFor={`certification-issuer-${index}`}>{t('issuer.label')}</Label>
                    <Input
                      id={`certification-issuer-${index}`}
                      placeholder={t('issuer.placeholder')}
                      error={errors.culinaryInfo?.certifications?.[index]?.issuer?.message}
                      {...field}
                    />
                  </>
                )}
              />

              <FormField
                control={control}
                name={`culinaryInfo.certifications.${index}.date`}
                rules={{
                  required: t('date.required'),
                  validate: async (value) => {
                    try {
                      await certificationsValidation.shape.date.parseAsync(value)
                      return true
                    } catch (error) {
                      return t('date.invalid')
                    }
                  },
                }}
                render={({ field }) => (
                  <>
                    <Label htmlFor={`certification-date-${index}`}>{t('date.label')}</Label>
                    <Input
                      id={`certification-date-${index}`}
                      type='date'
                      error={errors.culinaryInfo?.certifications?.[index]?.date?.message}
                      {...field}
                    />
                  </>
                )}
              />

              <FormField
                control={control}
                name={`culinaryInfo.certifications.${index}.expiryDate`}
                rules={{
                  validate: async (value) => {
                    if (!value) return true
                    try {
                      await certificationsValidation.shape.expiryDate.parseAsync(value)
                      return true
                    } catch (error) {
                      return t('expiryDate.invalid')
                    }
                  },
                }}
                render={({ field }) => (
                  <>
                    <Label htmlFor={`certification-expiry-${index}`}>{t('expiryDate.label')}</Label>
                    <Input
                      id={`certification-expiry-${index}`}
                      type='date'
                      error={errors.culinaryInfo?.certifications?.[index]?.expiryDate?.message}
                      {...field}
                    />
                  </>
                )}
              />

              <FormField
                control={control}
                name={`culinaryInfo.certifications.${index}.verificationLink`}
                rules={{
                  validate: async (value) => {
                    if (!value) return true
                    try {
                      await certificationsValidation.shape.verificationLink.parseAsync(value)
                      return true
                    } catch (error) {
                      return t('verificationLink.invalid')
                    }
                  },
                }}
                render={({ field }) => (
                  <>
                    <Label htmlFor={`certification-link-${index}`}>
                      {t('verificationLink.label')}
                    </Label>
                    <Input
                      id={`certification-link-${index}`}
                      placeholder={t('verificationLink.placeholder')}
                      error={
                        errors.culinaryInfo?.certifications?.[index]?.verificationLink?.message
                      }
                      {...field}
                    />
                  </>
                )}
              />
            </div>
          )}
        />
      </div>
    </FormSection>
  )
}
