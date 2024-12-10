'use client'

import { Control, FieldErrors } from 'react-hook-form'
import { FormSection } from '@/components/ui/form/FormSection'
import { FormInput } from '@/components/ui/form/FormInput'
import { FormArrayField } from '@/components/ui/form/FormArrayField'
import { IconCertificate } from '@/components/ui/icons'
import type { ProProfileMetadata } from '@/types/profile'

interface CertificationsSectionProps {
  control: Control<ProProfileMetadata>
  errors: FieldErrors<ProProfileMetadata>
}

// Helper function to create empty certification
const createEmptyCertification = () => ({
  name: '',
  issuer: '',
  date: '',
  expiryDate: '',
  verificationLink: '',
})

export function CertificationsSection({ control, errors }: CertificationsSectionProps) {
  return (
    <FormSection icon={IconCertificate} title='Certifications'>
      <div className='space-y-6'>
        <FormArrayField
          control={control}
          name='culinaryInfo.certifications'
          label='Professional Certifications'
          addButtonText='Add Certification'
          validate={(value) => {
            if (!value.name) return 'Certification name is required'
            if (!value.issuer) return 'Issuer is required'
            if (!value.date) return 'Date is required'
            return true
          }}
          render={({ field }) => (
            <div className='space-y-4'>
              <FormInput
                {...field}
                name={`${field.name}.name`}
                label='Certification Name'
                placeholder='Enter certification name'
                error={errors.culinaryInfo?.certifications?.[field.name]?.name?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.issuer`}
                label='Issuing Organization'
                placeholder='Enter issuing organization'
                error={errors.culinaryInfo?.certifications?.[field.name]?.issuer?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.date`}
                label='Date Received'
                type='date'
                error={errors.culinaryInfo?.certifications?.[field.name]?.date?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.expiryDate`}
                label='Expiry Date (Optional)'
                type='date'
                error={errors.culinaryInfo?.certifications?.[field.name]?.expiryDate?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.verificationLink`}
                label='Verification Link (Optional)'
                placeholder='Enter verification URL'
                error={errors.culinaryInfo?.certifications?.[field.name]?.verificationLink?.message}
              />
            </div>
          )}
        />
      </div>
    </FormSection>
  )
}
