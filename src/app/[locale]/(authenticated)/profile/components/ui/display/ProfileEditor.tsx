'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form/FormInput'
import { FormTextarea } from '@/components/ui/form/FormTextarea'
import { toast } from 'sonner'
import { type Profile } from '@/app/[locale]/(authenticated)/profile/profile'
import { profileSchema } from '@/lib/validations/profile.validation'

interface ProfileEditorProps {
  profile: Profile
  onSave: (data: Profile) => Promise<void>
  onCancel: () => void
}

export function ProfileEditor({ profile, onSave, onCancel }: ProfileEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...profile,
    },
  })

  const onSubmit = async (data: Profile) => {
    try {
      setIsSubmitting(true)
      await onSave(data)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <FormInput
        label='Name'
        {...register('metadata.name')}
        error={errors.metadata?.name?.message}
      />

      <FormTextarea
        label='Bio'
        {...register('metadata.bio')}
        error={errors.metadata?.bio?.message}
      />

      <div className='flex justify-end space-x-2'>
        <Button type='button' onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
