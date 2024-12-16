'use client'

import { useProfile } from '@/app/api/providers/ProfileProvider'
import { ProfileEditor } from './ProfileEditor'
import { ProfileDisplay } from './ProfileDisplay'
import { useOptimistic, useState } from 'react'
import { type Profile } from '@/app/[locale]/(authenticated)/profile/profile'

interface ProfileViewProps {
  address?: string
}

export function ProfileView({ address }: ProfileViewProps) {
  const { profile, error } = useProfile(address)
  const [isEditing, setIsEditing] = useState(false)
  const [optimisticProfile, updateOptimisticProfile] = useOptimistic(
    profile,
    (state: Profile | null, newData: Partial<Profile>) => ({
      ...state,
      metadata: { ...state?.metadata, ...newData },
    })
  )

  if (error) {
    return (
      <div className='bg-github-danger-subtle text-github-danger-fg p-4 rounded-lg'>
        {error.message}
      </div>
    )
  }

  const canEdit = !address

  return isEditing && canEdit ? (
    <ProfileEditor
      onComplete={() => setIsEditing(false)}
      onOptimisticUpdate={updateOptimisticProfile}
    />
  ) : (
    <ProfileDisplay
      profile={optimisticProfile}
      onEdit={canEdit ? () => setIsEditing(true) : undefined}
    />
  )
}
