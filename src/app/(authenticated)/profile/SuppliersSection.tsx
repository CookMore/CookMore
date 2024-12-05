'use client'

import { Control, FieldErrors } from 'react-hook-form'
import { FormSection } from '@/components/ui/form/FormSection'
import { FormArrayField } from '@/components/ui/form/FormArrayField'
import { FormInput } from '@/components/ui/form/FormInput'
import { IconBuildingStore } from '@/components/ui/icons'
import type { GroupProfileMetadata } from '@/types/profile'

interface SuppliersSectionProps {
  control: Control<GroupProfileMetadata>
  errors: FieldErrors<GroupProfileMetadata>
  watchedFields?: any
}

export default function SuppliersSection({ control, errors }: SuppliersSectionProps) {
  return (
    <FormSection
      title='Suppliers & Vendors'
      icon={<IconBuildingStore />}
      description='Manage your supplier relationships'
    >
      <FormArrayField
        control={control}
        name='suppliers'
        label='Suppliers List'
        error={errors.suppliers?.message}
        addButtonText='Add Supplier'
        renderItem={(field, index) => (
          <div className='space-y-4 p-4 border rounded-md'>
            <FormInput
              control={control}
              name={`suppliers.${index}.name`}
              label='Supplier Name'
              error={errors.suppliers?.[index]?.name?.message}
            />

            <FormInput
              control={control}
              name={`suppliers.${index}.contact`}
              label='Contact Information'
              error={errors.suppliers?.[index]?.contact?.message}
            />

            <FormInput
              control={control}
              name={`suppliers.${index}.items`}
              label='Supplied Items'
              error={errors.suppliers?.[index]?.items?.message}
              multiline
            />

            <FormInput
              control={control}
              name={`suppliers.${index}.terms`}
              label='Supply Terms'
              error={errors.suppliers?.[index]?.terms?.message}
              multiline
              optional
            />

            <FormInput
              control={control}
              name={`suppliers.${index}.rating`}
              label='Supplier Rating'
              type='number'
              min={1}
              max={5}
              error={errors.suppliers?.[index]?.rating?.message}
              optional
            />
          </div>
        )}
      />
    </FormSection>
  )
}
