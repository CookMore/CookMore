'use client'

import { Control, FieldErrors } from 'react-hook-form'
import { FormSection } from '@/components/ui/form/FormSection'
import { FormInput } from '@/components/ui/form/FormInput'
import { FormArrayField } from '@/components/ui/form/FormArrayField'
import type { ProProfileMetadata } from '@/types/profile'

interface CertificationsSectionProps {
  control: Control<ProProfileMetadata>
  errors: FieldErrors<ProProfileMetadata>
}

export default function CertificationsSection({ control, errors }: CertificationsSectionProps) {
  return (
    <FormSection
      title='Certifications'
      description='List your professional certifications'
      icon='certificate'
    >
      <div className='space-y-4'>
        <FormArrayField<ProProfileMetadata, 'professionalCertifications'>
          name='professionalCertifications'
          control={control}
          label='Certifications'
          emptyValue={{
            name: '',
            issuer: '',
            year: '',
          }}
          renderField={(field, index) => (
            <div className='space-y-2'>
              <FormInput
                name={`professionalCertifications.${index}.name`}
                label='Certification Name'
                control={control}
                error={errors.professionalCertifications?.[index]?.name?.message}
              />
              <FormInput
                name={`professionalCertifications.${index}.issuer`}
                label='Issuing Organization'
                control={control}
                error={errors.professionalCertifications?.[index]?.issuer?.message}
              />
              <FormInput
                name={`professionalCertifications.${index}.year`}
                label='Year Obtained'
                type='number'
                control={control}
                error={errors.professionalCertifications?.[index]?.year?.message}
              />
            </div>
          )}
        />
      </div>
    </FormSection>
  )
}
