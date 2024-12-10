'use client'

import { Control, FieldErrors } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FormField } from '@/components/ui/form'
import type { FreeProfileMetadata } from '@/types/profile'

interface BasicInfoSectionProps {
  control: Control<FreeProfileMetadata>
  errors: FieldErrors<FreeProfileMetadata>
}

export function BasicInfoSection({ control, errors }: BasicInfoSectionProps) {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <FormField
          control={control}
          name='basicInfo.name'
          render={({ field }) => (
            <Input
              id='name'
              placeholder='Enter your name'
              error={errors.basicInfo?.name?.message}
              {...field}
            />
          )}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='bio'>Bio</Label>
        <FormField
          control={control}
          name='basicInfo.bio'
          render={({ field }) => (
            <Textarea
              id='bio'
              placeholder='Tell us about yourself'
              error={errors.basicInfo?.bio?.message}
              {...field}
            />
          )}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='location'>Location</Label>
        <FormField
          control={control}
          name='basicInfo.location'
          render={({ field }) => (
            <Input
              id='location'
              placeholder='Enter your location'
              error={errors.basicInfo?.location?.message}
              {...field}
            />
          )}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='website'>Website</Label>
        <FormField
          control={control}
          name='basicInfo.website'
          render={({ field }) => (
            <Input
              id='website'
              placeholder='Enter your website URL'
              error={errors.basicInfo?.website?.message}
              {...field}
            />
          )}
        />
      </div>
    </div>
  )
}
