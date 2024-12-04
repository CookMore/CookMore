'use client'

import { useFormContext } from 'react-hook-form'
import { FormInput } from '@/components/ui/form/FormInput'
import { FormSection } from '@/components/ui/form/FormSection'
import type { GroupProfileMetadata } from '@/types/profile'

export default function OrganizationInfoSection() {
  const { control } = useFormContext<GroupProfileMetadata>()

  return (
    <FormSection title='Organization Information' description='Tell us about your organization'>
      <FormInput
        name='organizationName'
        label='Organization Name'
        control={control}
        rules={{ required: 'Organization name is required' }}
      />
      <FormInput
        name='organizationType'
        label='Organization Type'
        control={control}
        rules={{ required: 'Organization type is required' }}
      />
      {/* Add more organization fields as needed */}
    </FormSection>
  )
}
