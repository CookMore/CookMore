'use client'

import { useFormContext } from 'react-hook-form'
import { FormSection } from '@/components/ui/form/FormSection'
import { FormMultiSelect } from '@/components/ui/form/FormMultiSelect'
import type { ProProfileMetadata } from '@/types/profile'

interface LanguagesSectionProps {
  control: any
  errors: any
  watchedFields?: any
}

export default function LanguagesSection({
  control,
  errors,
  watchedFields,
}: LanguagesSectionProps) {
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    // Add more languages as needed
  ]

  return (
    <FormSection title='Languages' description='What languages do you speak?' icon='language'>
      <FormMultiSelect name='languages' label='Languages' control={control} options={languages} />
    </FormSection>
  )
}
