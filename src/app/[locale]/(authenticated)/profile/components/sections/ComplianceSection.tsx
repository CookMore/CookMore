'use client'

import React from 'react'
import { Control, FieldErrors } from 'react-hook-form'
import { Input } from '@/app/api/components/ui/input'
import { FormField } from '@/app/api/form/form'
import { Label } from '@/app/api/components/ui/label'
import { FormSection } from '@/app/api/form/FormSection'
import { FormSwitch } from '@/app/api/form/FormSwitch'
import { IconShield } from '@/app/api/icons'
import type { ProfileFormData, ProfileTier } from '@/app/api/types/profile'
import { useTranslations } from 'next-intl'
import { type Theme } from '@/app/api/providers/ThemeProvider'
import { groupProfileSchema } from '@/app/[locale]/(authenticated)/profile/validations/profile'

interface ComplianceSectionProps {
  control: Control<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  theme: Theme
  tier: ProfileTier
}

export function ComplianceSection({ control, errors, theme, tier }: ComplianceSectionProps) {
  const t = useTranslations('profile.compliance')

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
  const complianceValidation = groupProfileSchema.shape.compliance

  // Only render for GROUP tier
  if (tier !== ProfileTier.GROUP) {
    return null
  }

  return (
    <FormSection icon={IconShield} title={t('title')} className={sectionClasses}>
      <div className={fieldClasses}>
        <FormField
          control={control}
          name='compliance.hasHealthPermit'
          rules={{
            validate: async (value) => {
              try {
                await complianceValidation.shape.hasHealthPermit.parseAsync(value)
                return true
              } catch (error) {
                return t('hasHealthPermit.invalid')
              }
            },
          }}
          render={({ field }) => (
            <FormSwitch
              label={t('hasHealthPermit.label')}
              description={t('hasHealthPermit.description')}
              {...field}
            />
          )}
        />

        <FormField
          control={control}
          name='compliance.hasFoodSafetyCert'
          rules={{
            validate: async (value) => {
              try {
                await complianceValidation.shape.hasFoodSafetyCert.parseAsync(value)
                return true
              } catch (error) {
                return t('hasFoodSafetyCert.invalid')
              }
            },
          }}
          render={({ field }) => (
            <FormSwitch
              label={t('hasFoodSafetyCert.label')}
              description={t('hasFoodSafetyCert.description')}
              {...field}
            />
          )}
        />

        <FormField
          control={control}
          name='compliance.healthPermitNumber'
          rules={{
            validate: async (value) => {
              try {
                await complianceValidation.shape.healthPermitNumber.parseAsync(value)
                return true
              } catch (error) {
                return t('healthPermitNumber.invalid')
              }
            },
          }}
          render={({ field }) => (
            <>
              <Label htmlFor='healthPermitNumber'>{t('healthPermitNumber.label')}</Label>
              <Input
                id='healthPermitNumber'
                placeholder={t('healthPermitNumber.placeholder')}
                error={errors.compliance?.healthPermitNumber?.message}
                {...field}
              />
            </>
          )}
        />

        <FormField
          control={control}
          name='compliance.foodSafetyCertNumber'
          rules={{
            validate: async (value) => {
              try {
                await complianceValidation.shape.foodSafetyCertNumber.parseAsync(value)
                return true
              } catch (error) {
                return t('foodSafetyCertNumber.invalid')
              }
            },
          }}
          render={({ field }) => (
            <>
              <Label htmlFor='foodSafetyCertNumber'>{t('foodSafetyCertNumber.label')}</Label>
              <Input
                id='foodSafetyCertNumber'
                placeholder={t('foodSafetyCertNumber.placeholder')}
                error={errors.compliance?.foodSafetyCertNumber?.message}
                {...field}
              />
            </>
          )}
        />

        <FormField
          control={control}
          name='compliance.lastInspectionDate'
          rules={{
            validate: async (value) => {
              try {
                await complianceValidation.shape.lastInspectionDate.parseAsync(value)
                return true
              } catch (error) {
                return t('lastInspectionDate.invalid')
              }
            },
          }}
          render={({ field }) => (
            <>
              <Label htmlFor='lastInspectionDate'>{t('lastInspectionDate.label')}</Label>
              <Input
                id='lastInspectionDate'
                type='date'
                error={errors.compliance?.lastInspectionDate?.message}
                {...field}
              />
            </>
          )}
        />

        <FormField
          control={control}
          name='compliance.inspectionScore'
          rules={{
            validate: async (value) => {
              try {
                await complianceValidation.shape.inspectionScore.parseAsync(value)
                return true
              } catch (error) {
                return t('inspectionScore.invalid')
              }
            },
          }}
          render={({ field }) => (
            <>
              <Label htmlFor='inspectionScore'>{t('inspectionScore.label')}</Label>
              <Input
                id='inspectionScore'
                type='number'
                placeholder={t('inspectionScore.placeholder')}
                error={errors.compliance?.inspectionScore?.message}
                {...field}
              />
            </>
          )}
        />
      </div>
    </FormSection>
  )
}
