'use client'

import { Control, FieldErrors } from 'react-hook-form'
import { FormSection } from '@/components/ui/form/FormSection'
import { FormArrayField } from '@/components/ui/form/FormArrayField'
import { FormInput } from '@/components/ui/form/FormInput'
import { IconLink } from '@/components/ui/icons'
import type { FreeProfileMetadata } from '@/types/profile'

interface SocialLinksSectionProps {
  control: Control<FreeProfileMetadata>
  errors: FieldErrors<FreeProfileMetadata>
}

const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function SocialLinksSection({ control, errors }: SocialLinksSectionProps) {
  return (
    <FormSection icon={IconLink} title='Social Links'>
      <div className='space-y-6'>
        <FormArrayField
          control={control}
          name='social.urls'
          label='Social Media Links'
          addButtonText='Add Link'
          validate={(value) => {
            if (!value) return 'URL is required'
            if (!isValidUrl(value)) return 'Invalid URL'
            return true
          }}
          render={({ field }) => (
            <FormInput
              {...field}
              placeholder='Enter social media URL'
              error={errors.social?.urls?.message}
            />
          )}
        />

        <FormArrayField
          control={control}
          name='social.labels'
          label='Link Labels'
          addButtonText='Add Label'
          validate={(value) => {
            if (!value) return 'Label is required'
            return true
          }}
          render={({ field }) => (
            <FormInput
              {...field}
              placeholder='Enter label for link'
              error={errors.social?.labels?.message}
            />
          )}
        />
      </div>
    </FormSection>
  )
}
