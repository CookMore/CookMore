'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/app/api/components/ui/button'
import { toast } from 'sonner'
import { User } from '@privy-io/react-auth'
import { ProfileTier } from '../../profile'
import type { ProfileFormData } from '../../validations/profile'
import { useTheme } from '@/app/api/providers/core/ThemeProvider'
import {
  BasicInfoSection,
  CulinaryInfoSection,
  SocialLinksSection,
  ExperienceSection,
  CertificationsSection,
  OrganizationInfoSection,
  OGPreferencesSection,
} from '../sections'

interface ProfileEditorProps {
  user: User
  currentTier: ProfileTier
  hasProfile: boolean | null
  onCancel: () => void
}

export function ProfileEditor({ user, currentTier, hasProfile, onCancel }: ProfileEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const theme = useTheme()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormContext<ProfileFormData>()

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)
    try {
      // Handle form submission
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const sectionProps = {
    control,
    errors,
    theme,
    isLoading: isSubmitting,
    onSubmit,
    onValidationChange: (isValid: boolean) => {
      // Handle validation change if needed
    },
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <BasicInfoSection {...sectionProps} />
      <SocialLinksSection {...sectionProps} />

      {currentTier >= ProfileTier.PRO && (
        <>
          <CulinaryInfoSection {...sectionProps} />
          <ExperienceSection {...sectionProps} />
          <CertificationsSection {...sectionProps} />
        </>
      )}

      {currentTier >= ProfileTier.GROUP && <OrganizationInfoSection {...sectionProps} />}

      {currentTier === ProfileTier.OG && <OGPreferencesSection {...sectionProps} />}

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
