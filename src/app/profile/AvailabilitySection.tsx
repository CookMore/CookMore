'use client'

import { useFormContext } from 'react-hook-form'
import { FormSection } from '@/components/ui/form/FormSection'
import { FormSwitch } from '@/components/ui/form/FormSwitch'
import type { ProProfileMetadata } from '@/types/profile'

interface AvailabilitySectionProps {
  control: any
  errors: any
  watchedFields?: any
}

export default function AvailabilitySection({
  control,
  errors,
  watchedFields,
}: AvailabilitySectionProps) {
  return (
    <FormSection title='Availability' description='Let others know your availability' icon='clock'>
      <div className='space-y-4'>
        <FormSwitch name='availability.forHire' label='Available for Hire' control={control} />
        <FormSwitch
          name='availability.consulting'
          label='Available for Consulting'
          control={control}
        />
        <FormSwitch
          name='availability.collaborations'
          label='Open to Collaborations'
          control={control}
        />
        <FormSwitch name='availability.teaching' label='Available for Teaching' control={control} />
      </div>
    </FormSection>
  )
}
