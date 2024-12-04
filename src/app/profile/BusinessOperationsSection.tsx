import { useFormContext } from 'react-hook-form'
import { FormInput } from '@/components/ui/form/FormInput'
import { FormSection } from '@/components/ui/form/FormSection'
import { FormMultiSelect } from '@/components/ui/form/FormMultiSelect'
import { FormSwitch } from '@/components/ui/form/FormSwitch'
import type { GroupProfileMetadata } from '@/types/profile'

export default function BusinessOperationsSection() {
  const { control } = useFormContext<GroupProfileMetadata>()

  return (
    <FormSection title='Business Operations' description='Tell us about your business operations'>
      <div className='space-y-6'>
        {/* Operating Status */}
        <div className='space-y-4'>
          <h4 className='font-medium'>Operating Status</h4>
          <FormSwitch name='isCurrentlyOperating' label='Currently Operating' control={control} />
          <FormSwitch
            name='isAcceptingNewClients'
            label='Accepting New Clients'
            control={control}
          />
        </div>

        {/* Hours and Capacity */}
        <div className='space-y-4'>
          <h4 className='font-medium'>Hours & Capacity</h4>
          <FormInput
            name='operatingHours'
            label='Operating Hours'
            control={control}
            placeholder='e.g., Mon-Fri 9AM-5PM'
          />
          <FormInput
            name='serviceCapacity'
            label='Service Capacity'
            control={control}
            type='number'
            placeholder='Daily customer capacity'
          />
        </div>

        {/* Service Options */}
        <div className='space-y-4'>
          <h4 className='font-medium'>Service Options</h4>
          <FormMultiSelect
            name='serviceTypes'
            label='Service Types'
            control={control}
            options={[
              { value: 'dine-in', label: 'Dine-in' },
              { value: 'takeout', label: 'Takeout' },
              { value: 'delivery', label: 'Delivery' },
              { value: 'catering', label: 'Catering' },
              { value: 'private-events', label: 'Private Events' },
            ]}
          />
          <FormSwitch name='offersCatering' label='Offers Catering Services' control={control} />
          <FormSwitch name='offersPrivateEvents' label='Hosts Private Events' control={control} />
        </div>

        {/* Delivery Information */}
        <div className='space-y-4'>
          <h4 className='font-medium'>Delivery Options</h4>
          <FormSwitch name='offersDelivery' label='Offers Delivery' control={control} />
          <FormInput
            name='deliveryRadius'
            label='Delivery Radius'
            control={control}
            placeholder='e.g., 5 miles'
          />
        </div>

        {/* Payment & Reservations */}
        <div className='space-y-4'>
          <h4 className='font-medium'>Payment & Reservations</h4>
          <FormMultiSelect
            name='paymentMethods'
            label='Payment Methods'
            control={control}
            options={[
              { value: 'cash', label: 'Cash' },
              { value: 'credit', label: 'Credit Card' },
              { value: 'debit', label: 'Debit Card' },
              { value: 'mobile', label: 'Mobile Payment' },
              { value: 'crypto', label: 'Cryptocurrency' },
            ]}
          />
          <FormSwitch name='requiresReservation' label='Requires Reservation' control={control} />
          <FormInput
            name='reservationPolicy'
            label='Reservation Policy'
            control={control}
            placeholder='e.g., 24 hours notice required'
          />
        </div>

        {/* Additional Options */}
        <div className='space-y-4'>
          <h4 className='font-medium'>Additional Options</h4>
          <FormSwitch
            name='isWheelchairAccessible'
            label='Wheelchair Accessible'
            control={control}
          />
          <FormSwitch name='hasParking' label='Parking Available' control={control} />
          <FormSwitch name='isKidFriendly' label='Kid Friendly' control={control} />
        </div>
      </div>
    </FormSection>
  )
}
