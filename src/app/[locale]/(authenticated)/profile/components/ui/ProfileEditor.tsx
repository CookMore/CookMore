'use client'

import { useFormStatus } from 'react-dom'
import { useNFTTiers } from '@/hooks/useNFTTiers'
import { useProfile } from '@/app/api/providers/ProfileProvider'
import { usePrivy } from '@privy-io/react-auth'
import { Suspense, startTransition } from 'react'
import { BaseNameDisplay } from './BaseNameDisplay'
import { ProfileTypeSwitcher } from './ProfileTypeSwitcher'
import { ProfileSessionWarning } from './ProfileSessionWarning'
import { ImageUploadPopover } from '@/components/ui/ImageUploadPopover'
import { ipfsService } from '@/lib/services/ipfs-service'
import { FormSkeleton } from '@/components/ui/skeletons/FormSkeleton'

interface ProfileEditorProps {
  onComplete: () => void
  onOptimisticUpdate: (data: any) => void
  fallback?: React.ReactNode
}

export function ProfileEditor({
  onComplete,
  onOptimisticUpdate,
  fallback = <FormSkeleton />,
}: ProfileEditorProps) {
  const { user } = usePrivy()
  const { profile, updateProfile } = useProfile()
  const { hasPro, hasGroup } = useNFTTiers()
  const { pending } = useFormStatus()

  // Show fallback while loading
  if (!user || !profile) {
    return fallback
  }

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
              <div className='flex items-center gap-4'>
                <ImageUploadPopover
                  currentImage={profile?.metadata.avatar}
                  onSelect={handleImageSelect}
                  onRemove={handleRemove}
                  loading={pending}
                />
                <div className='flex-1'>
                  <h3 className='text-sm font-medium text-github-fg-muted mb-2'>Your Base Name</h3>
                  <BaseNameDisplay
                    address={user.wallet.address as `0x${string}`}
                    showAvatar={true}
                    showAddress={true}
                    className='bg-github-canvas-default p-3 rounded-md'
                  />
                </div>
              </div>
            </div>
          )}
        </Suspense>
      </div>

      {/* Profile Type Switcher */}
      <Suspense fallback={<div>Loading tier status...</div>}>
        <ProfileTypeSwitcher hasPro={hasPro} hasGroup={hasGroup} />
      </Suspense>

      {/* Dynamic Profile Form */}
      <Suspense fallback={<div>Loading profile form...</div>}>
        <ProfileForm hasPro={hasPro} hasGroup={hasGroup} onOptimisticUpdate={onOptimisticUpdate} />
      </Suspense>
    </div>
  )
}
