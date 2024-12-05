'use client'

import { useProfile } from '@/app/providers/ProfileProvider'
import { ProfileEditor } from './ProfileEditor'
import { ProfileDisplay } from './ProfileDisplay'
import { useOptimistic, useState } from 'react'
import { type Profile } from '@/types/profile'

export function ProfileView() {
  const { profile, error } = useProfile()
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

  return isEditing ? (
    <ProfileEditor
      onComplete={() => setIsEditing(false)}
      onOptimisticUpdate={updateOptimisticProfile}
    />
  ) : (
    <ProfileDisplay profile={optimisticProfile} onEdit={() => setIsEditing(true)} />
  )
}
