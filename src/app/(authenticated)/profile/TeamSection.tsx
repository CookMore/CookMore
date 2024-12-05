import { useFormContext } from 'react-hook-form'
import { FormInput } from '@/components/ui/form/FormInput'
import { FormSection } from '@/components/ui/form/FormSection'
import type { GroupProfileMetadata } from '@/types/profile'

export default function TeamSection() {
  const { control } = useFormContext<GroupProfileMetadata>()

  return (
    <FormSection title='Team Information' description='Tell us about your team'>
      <FormInput
        name='teamSize'
        label='Team Size'
        type='number'
        control={control}
        rules={{ required: 'Team size is required' }}
      />
      {/* Add more team fields as needed */}
    </FormSection>
  )
}
