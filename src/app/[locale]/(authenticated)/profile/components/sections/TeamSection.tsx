'use client'

// Form imports
import { Control, FieldErrors, useFormContext } from 'react-hook-form'

// UI Component imports
import { FormInput } from '@/app/api/form/FormInput'
import { FormSection } from '@/app/api/form/FormSection'
import { FormArrayField } from '@/app/api/form/FormArrayField'
import { IconUsers } from '@/app/api/icons'

// Type imports
import type { GroupProfileMetadata } from '@/app/[locale]/(authenticated)/profile/profile'

interface TeamSectionProps {
  control?: Control<GroupProfileMetadata>
  errors?: FieldErrors<GroupProfileMetadata>
}

export function TeamSection({ control, errors }: TeamSectionProps) {
  return (
    <FormSection icon={IconUsers} title='Team Members'>
      <div className='space-y-6'>
        <FormArrayField
          control={control}
          name='team.members'
          label='Team Members'
          addButtonText='Add Team Member'
          validate={(value) => {
            if (!value.name) return 'Name is required'
            if (!value.role) return 'Role is required'
            return true
          }}
          render={({ field }) => (
            <div className='space-y-4'>
              <FormInput
                {...field}
                name={`${field.name}.name`}
                label='Name'
                placeholder='Enter team member name'
                error={errors?.team?.members?.[field.name]?.name?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.role`}
                label='Role'
                placeholder='Enter team member role'
                error={errors?.team?.members?.[field.name]?.role?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.bio`}
                label='Bio'
                placeholder='Enter team member bio'
                error={errors?.team?.members?.[field.name]?.bio?.message}
              />
            </div>
          )}
        />
      </div>
    </FormSection>
  )
}
