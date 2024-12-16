'use client'

import { Control, FieldErrors } from 'react-hook-form'
import { FormSection } from '@/app/api/form/FormSection'
import { FormInput } from '@/app/api/form/FormInput'
import { FormArrayField } from '@/app/api/form/FormArrayField'
import { IconStore } from '@/app/api/icons'
import type {
  GroupProfileMetadata,
  ProProfileMetadata,
} from '@/app/[locale]/(authenticated)/profile/profile'
import { toast } from 'sonner'

interface MarketingSectionProps {
  control?: Control<ProProfileMetadata>
  errors?: FieldErrors<ProProfileMetadata>
}

const isValidHexColor = (color: string) => {
  const isValid = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
  if (!isValid) {
    toast.error('Invalid Color', {
      description: 'Please enter a valid hex color code (e.g. #FF0000)',
    })
  }
  return isValid
}

const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    toast.error('Invalid URL', {
      description: 'Please enter a valid URL including http:// or https://',
    })
    return false
  }
}

export function MarketingSection({ control, errors }: MarketingSectionProps) {
  return (
    <FormSection icon={<IconStore />} title='Marketing & Branding'>
      <div className='space-y-6'>
        <FormInput
          control={control}
          name='marketing.tagline'
          label='Tagline'
          placeholder='Enter your business tagline'
          error={errors?.marketing?.tagline?.message}
        />

        <FormArrayField<ProProfileMetadata, string>
          control={control}
          name={'marketing.brandColors' as const}
          label='Brand Colors'
          addButtonText='Add Color'
          validate={(value: string) => {
            if (!value) return 'Color is required'
            if (!isValidHexColor(value)) return 'Invalid hex color code'
            return true
          }}
          render={({ field }) => (
            <FormInput
              {...field}
              type='color'
              placeholder='Enter hex color code'
              error={errors?.marketing?.brandColors?.message}
            />
          )}
        />

        <FormInput
          control={control}
          name='marketing.mediaKit'
          label='Media Kit URL'
          placeholder='Enter media kit URL'
          error={errors?.marketing?.mediaKit?.message}
          validate={(value) => {
            if (value && !isValidUrl(value)) return 'Invalid URL'
            return true
          }}
        />

        <FormArrayField<ProProfileMetadata, 'marketing.pressReleases'>
          control={control}
          name={'marketing.pressReleases' as const}
          label='Press Releases'
          addButtonText='Add Press Release'
          validate={(value) => {
            if (!value.title) return 'Title is required'
            if (!value.link) return 'URL is required'
            if (!isValidUrl(value.link)) return 'Invalid URL'
            return true
          }}
          render={({ field }) => (
            <div className='space-y-4'>
              <FormInput
                {...field}
                name={`${field.name}.title`}
                label='Title'
                placeholder='Enter press release title'
                error={errors?.marketing?.pressReleases?.[field.name]?.title?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.link`}
                label='URL'
                placeholder='Enter press release URL'
                error={errors?.marketing?.pressReleases?.[field.name]?.link?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.date`}
                label='Date'
                type='date'
                error={errors?.marketing?.pressReleases?.[field.name]?.date?.message}
              />
            </div>
          )}
        />

        <FormArrayField
          control={control}
          name='marketing.socialMedia'
          label='Social Media Links'
          addButtonText='Add Social Media'
          validate={(value) => {
            if (!value.platform) return 'Platform is required'
            if (!value.url) return 'URL is required'
            if (!isValidUrl(value.url)) return 'Invalid URL'
            return true
          }}
          render={({ field }) => (
            <div className='space-y-4'>
              <FormInput
                {...field}
                name={`${field.name}.platform`}
                label='Platform'
                placeholder='Enter social media platform'
                error={errors?.marketing?.socialMedia?.[field.name]?.platform?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.url`}
                label='URL'
                placeholder='Enter social media URL'
                error={errors?.marketing?.socialMedia?.[field.name]?.url?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.handle`}
                label='Handle/Username'
                placeholder='Enter social media handle'
                error={errors?.marketing?.socialMedia?.[field.name]?.handle?.message}
              />
            </div>
          )}
        />

        <FormArrayField
          control={control}
          name='marketing.promotions'
          label='Promotions'
          addButtonText='Add Promotion'
          validate={(value) => {
            if (!value.title) return 'Title is required'
            if (!value.description) return 'Description is required'
            if (!value.startDate) return 'Start date is required'
            if (!value.endDate) return 'End date is required'
            return true
          }}
          render={({ field }) => (
            <div className='space-y-4'>
              <FormInput
                {...field}
                name={`${field.name}.title`}
                label='Title'
                placeholder='Enter promotion title'
                error={errors?.marketing?.promotions?.[field.name]?.title?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.description`}
                label='Description'
                placeholder='Enter promotion description'
                error={errors?.marketing?.promotions?.[field.name]?.description?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.startDate`}
                label='Start Date'
                type='date'
                error={errors?.marketing?.promotions?.[field.name]?.startDate?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.endDate`}
                label='End Date'
                type='date'
                error={errors?.marketing?.promotions?.[field.name]?.endDate?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.terms`}
                label='Terms & Conditions'
                placeholder='Enter terms and conditions'
                error={errors?.marketing?.promotions?.[field.name]?.terms?.message}
              />
            </div>
          )}
        />
      </div>
    </FormSection>
  )
}
