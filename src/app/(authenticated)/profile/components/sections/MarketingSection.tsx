'use client'

import { Control, FieldErrors } from 'react-hook-form'
import { FormSection } from '@/components/ui/form/FormSection'
import { FormInput } from '@/components/ui/form/FormInput'
import { FormArrayField } from '@/components/ui/form/FormArrayField'
import { IconStore } from '@/components/ui/icons'
import type { GroupProfileMetadata } from '@/types/profile'

interface MarketingSectionProps {
  control?: Control<GroupProfileMetadata>
  errors?: FieldErrors<GroupProfileMetadata>
}

const isValidHexColor = (color: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function MarketingSection({ control, errors }: MarketingSectionProps) {
  return (
    <FormSection icon={IconStore} title='Marketing & Branding'>
      <div className='space-y-6'>
        <FormInput
          control={control}
          name='marketing.tagline'
          label='Tagline'
          placeholder='Enter your business tagline'
          error={errors?.marketing?.tagline?.message}
        />

        <FormArrayField
          control={control}
          name='marketing.brandColors'
          label='Brand Colors'
          addButtonText='Add Color'
          validate={(value) => {
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

        <FormArrayField
          control={control}
          name='marketing.pressReleases'
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
