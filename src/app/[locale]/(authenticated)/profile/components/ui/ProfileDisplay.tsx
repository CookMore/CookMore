'use client'

import { User } from '@privy-io/react-auth'
import { useState, useEffect } from 'react'
import { Button } from '@/app/api/components/ui/button'
import { ProfileCard } from './ProfileCard'
import { cn } from '@/app/api/utils/utils'
import { IconUser, IconEye, IconEdit, IconCertificate } from '@/app/api/icons'
import { ipfsService } from '@/app/[locale]/(authenticated)/profile/services/ipfs/ipfs.service'

interface ProfileDisplayProps {
  profile: User & {
    name?: string
    avatar?: string
    bio?: string
  }
  isPublicView?: boolean
  hasProfile: boolean | null
  onEdit?: () => void
}

export function ProfileDisplay({ profile, isPublicView, hasProfile, onEdit }: ProfileDisplayProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!profile || !mounted) return null

  const getImageUrl = (url?: string | null) => {
    if (!url) return ''
    try {
      if (url.startsWith('blob:')) return url
      if (url.startsWith('ipfs:')) return ipfsService.getHttpUrl(url)
      if (url.startsWith('http:') || url.startsWith('https:')) return url
      return ipfsService.getHttpUrl(`ipfs://${url}`)
    } catch (error) {
      console.error('Error processing image URL:', error)
      return ''
    }
  }

  return (
    <div className='flex flex-col lg:flex-row gap-4 p-4'>
      {/* NFT Display */}
      <div className='flex-none'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-2'>
            <IconCertificate className='w-5 h-5 text-github-fg-default' />
            <h2 className='text-lg font-semibold text-github-fg-default'>NFT Profile</h2>
          </div>
          {!isPublicView && onEdit && (
            <Button
              onClick={onEdit}
              className='flex items-center gap-2'
              variant='outline'
              size='sm'
            >
              <IconEdit className='w-3.5 h-3.5' />
              {hasProfile ? 'Edit NFT' : 'Create NFT'}
            </Button>
          )}
        </div>

        <div className='rounded-lg border border-github-border-default shadow-lg bg-github-canvas-default w-[300px] mx-auto lg:mx-0'>
          {/* NFT Header */}
          <div className='p-3 border-b border-github-border-default'>
            <h3 className='text-base font-semibold text-github-fg-default'>
              {profile.name || 'Unnamed Profile'}
            </h3>
          </div>

          {/* NFT Content */}
          <div className='p-4 space-y-4'>
            {/* Profile Image */}
            <div className='flex justify-center'>
              {profile.avatar ? (
                <img
                  src={getImageUrl(profile.avatar)}
                  alt='Profile'
                  className='w-32 h-32 rounded-lg object-cover border-2 border-white shadow-md'
                />
              ) : (
                <div className='w-32 h-32 rounded-lg bg-github-canvas-subtle border-2 border-white shadow-md flex items-center justify-center'>
                  <IconUser className='w-16 h-16 text-github-fg-muted' />
                </div>
              )}
            </div>

            {/* Bio */}
            <div className='text-center'>
              <p className='text-sm text-github-fg-default line-clamp-3'>
                {profile.bio || 'No bio yet'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Extended Profile Information */}
      <div className='flex-1'>
        <div className='flex items-center gap-2 mb-2'>
          <IconEye className='w-5 h-5 text-github-fg-default' />
          <h2 className='text-lg font-semibold text-github-fg-default'>Profile Details</h2>
        </div>

        {hasProfile ? (
          <div className='rounded-lg border border-github-border-default bg-github-canvas-default p-4'>
            <ProfileCard profile={profile} />
          </div>
        ) : (
          !isPublicView && (
            <div className='text-center p-6 rounded-lg border border-github-border-default bg-github-canvas-default'>
              <IconUser className='w-10 h-10 text-github-fg-muted mx-auto mb-3' />
              <h3 className='text-base font-semibold text-github-fg-default mb-2'>
                No Profile Details
              </h3>
              <p className='text-sm text-github-fg-muted mb-3'>
                Add more details to showcase your culinary expertise
              </p>
              {onEdit && (
                <Button onClick={onEdit} className='flex items-center gap-2 mx-auto' size='sm'>
                  <IconEdit className='w-3.5 h-3.5' />
                  Add Details
                </Button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}
