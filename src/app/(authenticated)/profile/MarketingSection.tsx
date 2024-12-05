'use client'

import { Control, FieldErrors } from 'react-hook-form'
import { FormSection } from '@/components/ui/form/FormSection'
import { FormInput } from '@/components/ui/form/FormInput'
import { FormArrayField } from '@/components/ui/form/FormArrayField'
import { IconChartBar } from '@/components/ui/icons'
import type { GroupProfileMetadata } from '@/types/profile'

interface MarketingSectionProps {
  control: Control<GroupProfileMetadata>
  errors: FieldErrors<GroupProfileMetadata>
  watchedFields?: any
}

export default function MarketingSection({ control, errors }: MarketingSectionProps) {
  return (
    <FormSection
      title='Marketing & Branding'
      icon={<IconChartBar />}
      description='Manage your brand identity and marketing materials'
    >
      <FormInput
        control={control}
        name='marketing.tagline'
        label='Tagline'
        error={errors.marketing?.tagline?.message}
      />

      <FormInput
        control={control}
        name='marketing.mediaKit'
        label='Media Kit URL'
        error={errors.marketing?.mediaKit?.message}
      />

      <FormArrayField
        control={control}
        name='marketing.brandColors'
        label='Brand Colors'
        error={errors.marketing?.brandColors?.message}
        addButtonText='Add Color'
        renderItem={(field, index) => (
          <FormInput
            control={control}
            name={`marketing.brandColors.${index}`}
            placeholder='e.g. #FF5733'
          />
        )}
      />

      <FormArrayField
        control={control}
        name='marketing.socialMedia'
        label='Social Media Links'
        error={errors.marketing?.socialMedia?.message}
        addButtonText='Add Social Media'
        renderItem={(field, index) => (
          <FormInput
            control={control}
            name={`marketing.socialMedia.${index}`}
            placeholder='Social Media URL'
          />
        )}
      />

      <FormArrayField
        control={control}
        name='marketing.pressReleases'
        label='Press Releases'
        error={errors.marketing?.pressReleases?.message}
        addButtonText='Add Press Release'
        renderItem={(field, index) => (
          <FormInput
            control={control}
            name={`marketing.pressReleases.${index}`}
            placeholder='Press Release URL'
          />
        )}
      />

      <FormArrayField
        control={control}
        name='marketing.promotions'
        label='Current Promotions'
        error={errors.marketing?.promotions?.message}
        addButtonText='Add Promotion'
        renderItem={(field, index) => (
          <FormInput
            control={control}
            name={`marketing.promotions.${index}`}
            placeholder='Promotion Details'
          />
        )}
      />
    </FormSection>
  )
}
