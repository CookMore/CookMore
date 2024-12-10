'use client'

// Form imports
import { Control, FieldErrors, useFormContext } from 'react-hook-form'

// UI Component imports
import { FormInput } from '@/components/ui/form/FormInput'
import { FormSection } from '@/components/ui/form/FormSection'
import { FormSwitch } from '@/components/ui/form/FormSwitch'
import { IconShield } from '@/components/ui/icons'

// Type imports
import type { GroupProfileMetadata } from '@/types/profile'

interface ComplianceSectionProps {
  control?: Control<GroupProfileMetadata>
  errors?: FieldErrors<GroupProfileMetadata>
}

export function ComplianceSection({ control, errors }: ComplianceSectionProps) {
  return (
    <FormSection icon={IconShield} title='Compliance & Certifications'>
      <div className='space-y-6'>
        <FormSwitch
          control={control}
          name='compliance.hasHealthPermit'
          label='Health Permit'
          description='Do you have a valid health permit?'
        />

        <FormSwitch
          control={control}
          name='compliance.hasFoodSafetyCert'
          label='Food Safety Certification'
          description='Do you have food safety certification?'
        />

        <FormInput
          control={control}
          name='compliance.healthPermitNumber'
          label='Health Permit Number'
          placeholder='Enter health permit number'
          error={errors?.compliance?.healthPermitNumber?.message}
        />

        <FormInput
          control={control}
          name='compliance.foodSafetyCertNumber'
          label='Food Safety Certificate Number'
          placeholder='Enter certificate number'
          error={errors?.compliance?.foodSafetyCertNumber?.message}
        />

        <FormInput
          control={control}
          name='compliance.lastInspectionDate'
          label='Last Inspection Date'
          type='date'
          error={errors?.compliance?.lastInspectionDate?.message}
        />

        <FormInput
          control={control}
          name='compliance.inspectionScore'
          label='Last Inspection Score'
          type='number'
          placeholder='Enter inspection score'
          error={errors?.compliance?.inspectionScore?.message}
        />
      </div>
    </FormSection>
  )
}
