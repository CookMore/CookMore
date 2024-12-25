'use client'

import { useState } from 'react'
import { Camera } from 'lucide-react'
import { ImageUploadPopover } from '@/app/api/image/ImageUploadPopover'
import { ipfsService } from '@/app/[locale]/(authenticated)/profile/services/ipfs/ipfs.service'
import type { UploadProgress } from '../hooks/ipfs/useIPFS'
import { cn } from '@/app/api/utils/utils'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'

interface Position {
  x: number
  y: number
  scale: number
}

interface AvatarContainerProps {
  avatarUrl: string | null
  onUpload: (file: File) => Promise<string | null>
  onRemove?: () => void
  isUploading?: boolean
  uploadProgress?: UploadProgress | null
  error?: Error | null
  tier?: ProfileTier
}

const tierStyles = {
  [ProfileTier.FREE]: {
    ring: 'ring-github-border-default',
    border: 'border-github-border-default',
  },
  [ProfileTier.PRO]: {
    ring: 'ring-github-accent-emphasis',
    border: 'border-github-accent-emphasis',
  },
  [ProfileTier.GROUP]: {
    ring: 'ring-github-success-emphasis',
    border: 'border-github-success-emphasis',
  },
  [ProfileTier.OG]: {
    ring: 'ring-github-done-emphasis',
    border: 'border-github-done-emphasis',
  },
}

export function AvatarContainer({
  avatarUrl,
  onUpload,
  onRemove,
  isUploading = false,
  uploadProgress,
  error,
  tier = ProfileTier.FREE,
}: AvatarContainerProps) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0, scale: 1 })

  // Convert IPFS URL to HTTP URL if needed
  const displayUrl = avatarUrl?.startsWith('ipfs://')
    ? `https://gateway.pinata.cloud/ipfs/${avatarUrl.replace('ipfs://', '')}`
    : avatarUrl

  const style = tierStyles[tier]

  return (
    <div className='relative w-32 h-32'>
      {isUploading && (
        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-full'>
          <div className='text-white text-center'>
            {uploadProgress && (
              <div className='w-16 h-2 bg-gray-700 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-white transition-all duration-300'
                  style={{ width: `${uploadProgress.progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <ImageUploadPopover
        onImageSelect={onUpload}
        currentImageUrl={displayUrl}
        onRemove={onRemove}
        onPositionSet={(pos: Position) => {
          setPosition(pos)
        }}
        error={error?.message}
      >
        <div
          className={cn(
            'w-full h-full flex items-center justify-center cursor-pointer rounded-full overflow-hidden',
            'ring-4 ring-offset-2 ring-offset-github-canvas-default transition-shadow',
            style.ring,
            'hover:shadow-xl'
          )}
          style={{
            transform: `scale(${position.scale}) translate(${position.x}px, ${position.y}px)`,
          }}
        >
          <div className='relative w-full h-full overflow-hidden'>
            {displayUrl ? (
              <div className='relative w-full h-full'>
                <img
                  src={displayUrl}
                  alt='Avatar'
                  className='absolute w-full h-full object-cover'
                  style={{
                    transform: `scale(${position.scale}) translate(${position.x}px, ${position.y}px)`,
                  }}
                />
                <div className='absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'>
                  <div className='p-2 bg-black bg-opacity-50 rounded-full'>
                    <Camera className='w-6 h-6 text-white' />
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center space-y-2 bg-gray-100 w-full h-full'>
                <Camera className='w-8 h-8 text-gray-400' />
              </div>
            )}
          </div>
        </div>
      </ImageUploadPopover>
    </div>
  )
}
