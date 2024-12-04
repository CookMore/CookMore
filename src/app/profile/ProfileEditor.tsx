'use client'

import { useFormStatus } from 'react-dom'
import { useNFTTiers } from '@/hooks/useNFTTiers'
import { useProfile } from '@/providers/ProfileProvider'
import { usePrivy } from '@privy-io/react-auth'
import { Suspense, startTransition } from 'react'
import { ImageUploader } from '../ui/ImageUploader'
import { BaseNameDisplay } from './BaseNameDisplay'
import { ProfileTypeSwitcher } from './ProfileTypeSwitcher'
import { ProfileForms } from './ProfileForms'
import { ProfileSessionWarning } from './ProfileSessionWarning'
import { ipfsService } from '@/lib/services/ipfs-service'

interface ProfileEditorProps {
  onComplete: () => void
  onOptimisticUpdate: (data: any) => void
}

export function ProfileEditor({ onComplete, onOptimisticUpdate }: ProfileEditorProps) {
  const { user } = usePrivy()
  const { profile, updateProfile } = useProfile()
  const { hasPro, hasGroup } = useNFTTiers()
  const { pending } = useFormStatus()

  const handleImageSelect = async (file: File) => {
    try {
      // Start optimistic update
      onOptimisticUpdate({ avatar: URL.createObjectURL(file) })

      // Actual update
      startTransition(async () => {
        const ipfsUrl = await ipfsService.uploadFile(file)
        await updateProfile({
          ...profile?.metadata,
          avatar: ipfsUrl,
        })
      })
    } catch (error) {
      console.error('Failed to update profile image:', error)
    }
  }

  const handleRemove = async () => {
    try {
      // Start optimistic update
      onOptimisticUpdate({ avatar: '' })

      // Actual update
      startTransition(async () => {
        await updateProfile({
          ...profile?.metadata,
          avatar: '',
        })
      })
    } catch (error) {
      console.error('Failed to remove profile image:', error)
    }
  }

  return (
    <div className='p-6 space-y-8'>
      <ProfileSessionWarning />

      {/* Base Name & Avatar Section */}
      <div className='space-y-6'>
        <h2 className='text-xl font-semibold'>Edit Profile</h2>

        <Suspense fallback={<div>Loading base name...</div>}>
          {user?.wallet?.address && (
            <div className='p-4 bg-github-canvas-subtle rounded-lg'>
              <h3 className='text-sm font-medium text-github-fg-muted mb-2'>Your Base Name</h3>
              <BaseNameDisplay
                address={user.wallet.address as `0x${string}`}
                showAvatar={true}
                showAddress={true}
                className='bg-github-canvas-default p-3 rounded-md'
              />
            </div>
          )}
        </Suspense>

        <ImageUploader
          onImageSelect={handleImageSelect}
          currentImageUrl={
            profile?.metadata.avatar ? ipfsService.getIPFSUrl(profile.metadata.avatar) : undefined
          }
          onRemove={handleRemove}
          disabled={pending}
        />
      </div>

      {/* Profile Type Switcher */}
      <Suspense fallback={<div>Loading tier status...</div>}>
        <ProfileTypeSwitcher hasPro={hasPro} hasGroup={hasGroup} />
      </Suspense>

      {/* Dynamic Profile Forms */}
      <Suspense fallback={<div>Loading profile form...</div>}>
        <ProfileForms hasPro={hasPro} hasGroup={hasGroup} onOptimisticUpdate={onOptimisticUpdate} />
      </Suspense>
    </div>
  )
}
