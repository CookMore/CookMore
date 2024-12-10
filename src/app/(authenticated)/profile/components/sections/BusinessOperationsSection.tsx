'use client'

// Form imports
import { Control, FieldErrors, useFormContext } from 'react-hook-form'

// UI Component imports
import { FormInput } from '@/components/ui/form/FormInput'
import { FormSection } from '@/components/ui/form/FormSection'
import { FormMultiSelect } from '@/components/ui/form/FormMultiSelect'
import { FormSwitch } from '@/components/ui/form/FormSwitch'
import { IconGear } from '@/components/ui/icons'

// Type imports
import type { GroupProfileMetadata } from '@/types/profile'

interface BusinessOperationsSectionProps {
  control?: Control<GroupProfileMetadata>
  errors?: FieldErrors<GroupProfileMetadata>
}

// Constants
const BUSINESS_HOURS_OPTIONS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
]

const SERVICE_OPTIONS = [
  { value: 'catering', label: 'Catering' },
  { value: 'private-events', label: 'Private Events' },
  { value: 'meal-prep', label: 'Meal Prep' },
  { value: 'cooking-classes', label: 'Cooking Classes' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'takeout', label: 'Takeout' },
]

const AREA_OPTIONS = [
  { value: 'local', label: 'Local' },
  { value: 'regional', label: 'Regional' },
  { value: 'national', label: 'National' },
  { value: 'international', label: 'International' },
]

const PAYMENT_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'credit', label: 'Credit Card' },
  { value: 'debit', label: 'Debit Card' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
  { value: 'crypto', label: 'Cryptocurrency' },
]

const INSURANCE_OPTIONS = [
  { value: 'liability', label: 'Liability Insurance' },
  { value: 'workers-comp', label: 'Workers Compensation' },
  { value: 'property', label: 'Property Insurance' },
  { value: 'vehicle', label: 'Vehicle Insurance' },
]

export function BusinessOperationsSection({ control, errors }: BusinessOperationsSectionProps) {
  const { watch } = useFormContext<GroupProfileMetadata>()

  return (
    <FormSection icon={IconGear} title='Business Operations'>
      <div className='space-y-6'>
        <FormMultiSelect
          control={control}
          name='businessOperations.operatingHours'
          label='Operating Hours'
          placeholder='Select operating hours'
          options={BUSINESS_HOURS_OPTIONS}
          error={errors?.businessOperations?.operatingHours?.message}
        />

        <FormMultiSelect
          control={control}
          name='businessOperations.serviceTypes'
          label='Services Offered'
          placeholder='Select services'
          options={SERVICE_OPTIONS}
          error={errors?.businessOperations?.serviceTypes?.message}
        />

        <FormInput
          control={control}
          name='businessOperations.deliveryRadius'
          label='Delivery Radius'
          placeholder='Enter delivery radius (in miles/km)'
          error={errors?.businessOperations?.deliveryRadius?.message}
        />

        <FormInput
          control={control}
          name='businessOperations.cateringMinimum'
          label='Minimum Catering Order'
          placeholder='Enter minimum order amount'
          error={errors?.businessOperations?.cateringMinimum?.message}
        />

        <FormInput
          control={control}
          name='businessOperations.reservationPolicy'
          label='Reservation Policy'
          placeholder='Enter reservation policy'
          error={errors?.businessOperations?.reservationPolicy?.message}
        />

        <FormSwitch
          control={control}
          name='businessOperations.seasonalMenu'
          label='Seasonal Menu'
          description='Do you offer seasonal menu changes?'
        />

        {/* Capacity Section */}
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-github-fg-default'>Capacity Information</h3>

          <FormInput
            control={control}
            name='businessOperations.capacity.seating'
            label='Seating Capacity'
            placeholder='Enter seating capacity'
            error={errors?.businessOperations?.capacity?.seating?.message}
          />

          <FormInput
            control={control}
            name='businessOperations.capacity.eventSpace'
            label='Event Space Capacity'
            placeholder='Enter event space capacity'
            error={errors?.businessOperations?.capacity?.eventSpace?.message}
          />

          <FormInput
            control={control}
            name='businessOperations.capacity.trainingCapacity'
            label='Training Capacity'
            placeholder='Enter training capacity'
            error={errors?.businessOperations?.capacity?.trainingCapacity?.message}
          />

          <FormInput
            control={control}
            name='businessOperations.capacity.maxOccupancy'
            label='Maximum Occupancy'
            placeholder='Enter maximum occupancy'
            error={errors?.businessOperations?.capacity?.maxOccupancy?.message}
          />

          <FormInput
            control={control}
            name='businessOperations.capacity.privateRooms'
            label='Private Rooms'
            placeholder='Enter number of private rooms'
            error={errors?.businessOperations?.capacity?.privateRooms?.message}
          />
        </div>
      </div>
    </FormSection>
  )
}
