'use client'

import React from 'react'
import { Control, FieldErrors } from 'react-hook-form'
import { Input } from '@/app/api/components/ui/input'
import { FormField } from '@/app/api/form/form'
import { Label } from '@/app/api/components/ui/label'
import { FormSection } from '@/app/api/form/FormSection'
import { FormMultiSelect } from '@/app/api/form/FormMultiSelect'
import { FormSwitch } from '@/app/api/form/FormSwitch'
import { IconGear } from '@/app/api/icons'
import type { GroupProfileMetadata } from '@/app/[locale]/(authenticated)/profile/profile'
import { useTranslations } from 'next-intl'
import { type Theme } from '@/app/api/providers/ThemeProvider'
import { groupProfileSchema } from '@/app/[locale]/(authenticated)/profile/validations/profile'

interface BusinessOperationsSectionProps {
  control: Control<GroupProfileMetadata>
  errors: FieldErrors<GroupProfileMetadata>
  theme: Theme
}

// Constants
const BUSINESS_HOURS_OPTIONS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
]

const SERVICE_OPTIONS = [
  { value: 'catering', label: 'Catering' },
  { value: 'private-events', label: 'Private Events' },
  { value: 'meal-prep', label: 'Meal Prep' },
  { value: 'cooking-classes', label: 'Cooking Classes' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'takeout', label: 'Takeout' },
]

const AREA_OPTIONS = [
  { value: 'local', label: 'Local' },
  { value: 'regional', label: 'Regional' },
  { value: 'national', label: 'National' },
  { value: 'international', label: 'International' },
]

export function BusinessOperationsSection({
  control,
  errors,
  theme,
}: BusinessOperationsSectionProps) {
  const t = useTranslations('profile.businessOperations')

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
  const businessOperationsValidation = groupProfileSchema.shape.businessOperations

  return (
    <FormSection icon={IconGear} title={t('title')} className={sectionClasses}>
      <div className={fieldClasses}>
        <FormField
          control={control}
          name='businessOperations.operatingHours'
          rules={{
            validate: async (value) => {
              try {
                await businessOperationsValidation.shape.operatingHours.parseAsync(value)
                return true
              } catch (error) {
                return t('operatingHours.invalid')
              }
            },
          }}
          render={({ field }) => (
            <FormMultiSelect
              label={t('operatingHours.label')}
              placeholder={t('operatingHours.placeholder')}
              options={BUSINESS_HOURS_OPTIONS}
              error={errors.businessOperations?.operatingHours?.message}
              {...field}
            />
          )}
        />

        <FormField
          control={control}
          name='businessOperations.serviceTypes'
          rules={{
            validate: async (value) => {
              try {
                await businessOperationsValidation.shape.serviceTypes.parseAsync(value)
                return true
              } catch (error) {
                return t('serviceTypes.invalid')
              }
            },
          }}
          render={({ field }) => (
            <FormMultiSelect
              label={t('serviceTypes.label')}
              placeholder={t('serviceTypes.placeholder')}
              options={SERVICE_OPTIONS}
              error={errors.businessOperations?.serviceTypes?.message}
              {...field}
            />
          )}
        />

        <FormField
          control={control}
          name='businessOperations.deliveryRadius'
          rules={{
            validate: async (value) => {
              try {
                await businessOperationsValidation.shape.deliveryRadius.parseAsync(value)
                return true
              } catch (error) {
                return t('deliveryRadius.invalid')
              }
            },
          }}
          render={({ field }) => (
            <>
              <Label htmlFor='deliveryRadius'>{t('deliveryRadius.label')}</Label>
              <Input
                id='deliveryRadius'
                placeholder={t('deliveryRadius.placeholder')}
                error={errors.businessOperations?.deliveryRadius?.message}
                {...field}
              />
            </>
          )}
        />

        <FormField
          control={control}
          name='businessOperations.seasonalMenu'
          render={({ field }) => (
            <FormSwitch
              label={t('seasonalMenu.label')}
              description={t('seasonalMenu.description')}
              {...field}
            />
          )}
        />

        {/* Capacity Section */}
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-github-fg-default'>{t('capacity.title')}</h3>

          <FormField
            control={control}
            name='businessOperations.capacity.seating'
            rules={{
              validate: async (value) => {
                try {
                  await businessOperationsValidation.shape.capacity.shape.seating.parseAsync(value)
                  return true
                } catch (error) {
                  return t('capacity.seating.invalid')
                }
              },
            }}
            render={({ field }) => (
              <>
                <Label htmlFor='seating'>{t('capacity.seating.label')}</Label>
                <Input
                  id='seating'
                  placeholder={t('capacity.seating.placeholder')}
                  error={errors.businessOperations?.capacity?.seating?.message}
                  {...field}
                />
              </>
            )}
          />

          <FormField
            control={control}
            name='businessOperations.capacity.eventSpace'
            rules={{
              validate: async (value) => {
                try {
                  await businessOperationsValidation.shape.capacity.shape.eventSpace.parseAsync(
                    value
                  )
                  return true
                } catch (error) {
                  return t('capacity.eventSpace.invalid')
                }
              },
            }}
            render={({ field }) => (
              <>
                <Label htmlFor='eventSpace'>{t('capacity.eventSpace.label')}</Label>
                <Input
                  id='eventSpace'
                  placeholder={t('capacity.eventSpace.placeholder')}
                  error={errors.businessOperations?.capacity?.eventSpace?.message}
                  {...field}
                />
              </>
            )}
          />
        </div>
      </div>
    </FormSection>
  )
}
