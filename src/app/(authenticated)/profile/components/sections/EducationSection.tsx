'use client'

import { Control, FieldErrors } from 'react-hook-form'
import { FormInput } from '@/components/ui/form/FormInput'
import { FormSelect } from '@/components/ui/form/FormSelect'
import type { ProfileFormData } from '@/types/profile'

interface EducationSectionProps {
  control: Control<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
}

export function EducationSection({ control, errors }: EducationSectionProps) {
  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-1.5'>
        <h3 className='text-base font-semibold text-github-fg-default'>
          Education & Certifications
        </h3>
        <p className='text-sm text-github-fg-muted'>
          Share your culinary education and certifications.
        </p>
      </div>

      <div className='space-y-4'>
        <FormInput
          control={control}
          name='education.school'
          label='School/Institution'
          error={errors.education?.school?.message}
          placeholder='Culinary Institute of America'
        />

        <div className='grid grid-cols-2 gap-4'>
          <FormInput
            control={control}
            name='education.degree'
            label='Degree/Certification'
            error={errors.education?.degree?.message}
            placeholder='Bachelor of Culinary Arts'
          />

          <FormInput
            control={control}
            name='education.graduationYear'
            label='Graduation Year'
            type='number'
            error={errors.education?.graduationYear?.message}
            placeholder='2023'
          />
        </div>

        <FormSelect
          control={control}
          name='education.status'
          label='Status'
          error={errors.education?.status?.message}
          options={[
            { value: 'completed', label: 'Completed' },
            { value: 'inProgress', label: 'In Progress' },
            { value: 'planned', label: 'Planned' },
          ]}
        />

        <FormInput
          control={control}
          name='education.description'
          label='Description'
          multiline
          error={errors.education?.description?.message}
          placeholder='Describe your educational experience and key achievements'
          helperText='Optional: Add details about your specializations or notable projects'
        />
      </div>
    </div>
  )
}
