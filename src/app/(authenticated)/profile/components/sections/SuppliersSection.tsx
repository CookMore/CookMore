'use client'

import { Control, FieldErrors } from 'react-hook-form'
import { FormSection } from '@/components/ui/form/FormSection'
import { FormArrayField } from '@/components/ui/form/FormArrayField'
import { FormInput } from '@/components/ui/form/FormInput'
import { IconTruck } from '@/components/ui/icons'
import type { GroupProfileMetadata } from '@/types/profile'

interface SuppliersSectionProps {
  control: Control<GroupProfileMetadata>
  errors: FieldErrors<GroupProfileMetadata>
}

const createEmptySupplier = () => ({
  name: '',
  contact: '',
  items: '',
  terms: '',
  notes: '',
})

export function SuppliersSection({ control, errors }: SuppliersSectionProps) {
  return (
    <FormSection icon={IconTruck} title='Suppliers & Vendors'>
      <div className='space-y-6'>
        <FormArrayField
          control={control}
          name='suppliers'
          label='Suppliers'
          addButtonText='Add Supplier'
          validate={(value) => {
            if (!value.name) return 'Name is required'
            if (!value.contact) return 'Contact information is required'
            return true
          }}
          render={({ field }) => (
            <div className='space-y-4'>
              <FormInput
                {...field}
                name={`${field.name}.name`}
                label='Supplier Name'
                placeholder='Enter supplier name'
                error={errors?.suppliers?.[field.name]?.name?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.contact`}
                label='Contact Information'
                placeholder='Enter contact details'
                error={errors?.suppliers?.[field.name]?.contact?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.items`}
                label='Supplied Items'
                placeholder='Enter items supplied'
                error={errors?.suppliers?.[field.name]?.items?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.terms`}
                label='Payment Terms'
                placeholder='Enter payment terms'
                error={errors?.suppliers?.[field.name]?.terms?.message}
              />
              <FormInput
                {...field}
                name={`${field.name}.notes`}
                label='Additional Notes'
                placeholder='Enter any additional notes'
                error={errors?.suppliers?.[field.name]?.notes?.message}
              />
            </div>
          )}
        />
      </div>
    </FormSection>
  )
}
