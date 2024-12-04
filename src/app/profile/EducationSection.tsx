'use client'

import { useFormContext } from 'react-hook-form'
import { FormSection } from '@/components/ui/form/FormSection'
import { FormInput } from '@/components/ui/form/FormInput'
import { FormDateInput } from '@/components/ui/form/FormDateInput'
import type { ProProfileMetadata } from '@/types/profile'

interface EducationSectionProps {
  control: any
  errors: any
  watchedFields?: any
}

export default function EducationSection({
  control,
  errors,
  watchedFields,
}: EducationSectionProps) {
  return (
    <FormSection
      title='Education'
      description='Share your culinary education background'
      icon='graduation'
    >
      <div className='space-y-4'>
        <FormInput
          control={control}
          name='education'
          label='Education'
          error={errors.education?.message}
        />
      </div>
    </FormSection>
  )
}
