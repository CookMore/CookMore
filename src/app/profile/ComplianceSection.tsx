import { useFormContext } from 'react-hook-form'
import { FormInput } from '@/components/ui/form/FormInput'
import { FormSection } from '@/components/ui/form/FormSection'
import type { GroupProfileMetadata } from '@/types/profile'

export default function ComplianceSection() {
  const { control } = useFormContext<GroupProfileMetadata>()

  return (
    <FormSection
      title='Compliance Information'
      description='Tell us about your compliance standards'
    >
      <FormInput name='compliance.certifications' label='Certifications' control={control} />
      {/* Add more compliance fields as needed */}
    </FormSection>
  )
}
