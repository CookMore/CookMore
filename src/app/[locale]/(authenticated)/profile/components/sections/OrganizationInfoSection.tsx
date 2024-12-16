'use client'

// Form imports
import { Control, FieldErrors } from 'react-hook-form'

// UI Component imports
import { FormInput } from '@/app/api/form/FormInput'
import { FormSection } from '@/app/api/form/FormSection'
import { IconBuilding } from '@/app/api/icons'

// Type imports
import type { GroupProfileMetadata } from '@/app/[locale]/(authenticated)/profile/profile'

interface OrganizationInfoSectionProps {
  control: Control<GroupProfileMetadata>
  errors: FieldErrors<GroupProfileMetadata>
}

export function OrganizationInfoSection({ control, errors }: OrganizationInfoSectionProps) {
  return (
    <FormSection icon={IconBuilding} title='Organization Information'>
      <div className='space-y-6'>
        <FormInput
          control={control}
          name='organizationInfo.name'
          label='Organization Name'
          placeholder='Enter organization name'
          error={errors?.organizationInfo?.name?.message}
        />

        <FormInput
          control={control}
          name='organizationInfo.registrationNumber'
          label='Registration Number'
          placeholder='Enter registration number'
          error={errors?.organizationInfo?.registrationNumber?.message}
        />

        <FormInput
          control={control}
          name='organizationInfo.taxId'
          label='Tax ID'
          placeholder='Enter tax ID'
          error={errors?.organizationInfo?.taxId?.message}
        />

        <FormInput
          control={control}
          name='organizationInfo.address'
          label='Business Address'
          placeholder='Enter business address'
          error={errors?.organizationInfo?.address?.message}
        />

        <FormInput
          control={control}
          name='organizationInfo.phone'
          label='Business Phone'
          placeholder='Enter business phone'
          error={errors?.organizationInfo?.phone?.message}
        />

        <FormInput
          control={control}
          name='organizationInfo.email'
          label='Business Email'
          type='email'
          placeholder='Enter business email'
          error={errors?.organizationInfo?.email?.message}
        />
      </div>
    </FormSection>
  )
}
