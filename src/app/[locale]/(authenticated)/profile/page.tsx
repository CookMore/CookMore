'use client'

import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { useParams } from 'next/navigation'
import { DualSidebarLayout } from '@/app/api/layouts/DualSidebarLayout'
import { ProfileDisplay } from './components/ui/ProfileDisplay'
import { ProfileEditor } from './components/ui/ProfileEditor'
import { ProfileSkeleton } from './components/ui/ProfileSkeleton'
import { useState } from 'react'
import { ProfileTier } from './profile'

export default function ProfilePage() {
  const { user, hasProfile, currentTier } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const params = useParams()
  const isOwnProfile = user?.wallet?.address === params.address

  const handleSettingsClick = () => {
    setIsEditing(true)
  }

  if (!user) {
    return <ProfileSkeleton />
  }

  return (
    <DualSidebarLayout>
      {isEditing ? (
        <ProfileEditor
          user={user}
          currentTier={currentTier as ProfileTier}
          onCancel={() => setIsEditing(false)}
          hasProfile={hasProfile}
        />
      ) : (
        <ProfileDisplay
          profile={user}
          currentTier={currentTier as ProfileTier}
          isPublicView={!isOwnProfile}
          hasProfile={hasProfile}
          onEdit={isOwnProfile ? handleSettingsClick : undefined}
        />
      )}
    </DualSidebarLayout>
  )
}
