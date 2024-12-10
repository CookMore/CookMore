'use client'

import { Control, FieldErrors } from 'react-hook-form'
import { FormSection } from '@/components/ui/form/FormSection'
import { FormMultiSelect } from '@/components/ui/form/FormMultiSelect'
import { IconLanguage } from '@/components/ui/icons'
import type { ProProfileMetadata } from '@/types/profile'

interface LanguagesSectionProps {
  control: Control<ProProfileMetadata>
  errors: FieldErrors<ProProfileMetadata>
}

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'ar', label: 'Arabic' },
  { value: 'hi', label: 'Hindi' },
]

const PROFICIENCY_OPTIONS = [
  { value: 'basic', label: 'Basic' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'native', label: 'Native' },
]

export function LanguagesSection({ control, errors }: LanguagesSectionProps) {
  return (
    <FormSection icon={IconLanguage} title='Languages'>
      <div className='space-y-6'>
        <FormMultiSelect
          control={control}
          name='languages'
          label='Languages'
          placeholder='Select languages'
          options={LANGUAGE_OPTIONS}
          error={errors?.languages?.message}
        />

        <FormMultiSelect
          control={control}
          name='languageProficiency'
          label='Language Proficiency'
          placeholder='Select proficiency levels'
          options={PROFICIENCY_OPTIONS}
          error={errors?.languageProficiency?.message}
        />
      </div>
    </FormSection>
  )
}
