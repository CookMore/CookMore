'use client'

// Form imports
import { Control, FieldErrors } from 'react-hook-form'

// UI Component imports
import { FormSection } from '@/app/api/form/FormSection'
import { FormSwitch } from '@/app/api/form/FormSwitch'
import { IconCalendar } from '@/app/api/icons'

// Type imports
import type { ProfileFormData } from '@/app/[locale]/(authenticated)/profile/profile'

interface AvailabilitySectionProps {
  control: Control<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  theme?: string
}

export function AvailabilitySection({ control, errors, theme }: AvailabilitySectionProps) {
  return (
    <FormSection icon={IconCalendar} title='Availability' theme={theme}>
      <div className='space-y-6'>
        <FormSwitch
          control={control}
          name='availability.forHire'
          label='Available for Hire'
          description='Are you currently available for hire?'
        />

        <FormSwitch
          control={control}
          name='availability.consulting'
          label='Available for Consulting'
          description='Are you available for consulting work?'
        />

        <FormSwitch
          control={control}
          name='availability.collaborations'
          label='Open to Collaborations'
          description='Are you interested in collaborations?'
        />

        <FormSwitch
          control={control}
          name='availability.teaching'
          label='Available for Teaching'
          description='Are you available for teaching or mentoring?'
        />
      </div>
    </FormSection>
  )
}
