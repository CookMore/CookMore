'use client'

import { useState, useMemo } from 'react'
import { Camera } from 'lucide-react'
import { ImageUploadPopover } from '@/app/api/image/ImageUploadPopover'
import { cn } from '@/app/api/utils/utils'
import type { UploadProgress } from '../hooks/ipfs/useIPFS'
import { useAccount } from 'wagmi'
import { usePrivy } from '@privy-io/react-auth'
import Image from 'next/image'

interface Position {
  x: number
  y: number
  scale: number
}

interface AvatarUploadPopoverProps {
  avatarUrl: string | null
  onUpload: (file: File) => Promise<string | null>
  onRemove?: () => void
  isUploading?: boolean
  uploadProgress?: UploadProgress | null
  error?: Error | null
  address?: string
  size?: number
  required?: boolean
}

const AvatarUploadPopover = ({
  avatarUrl,
  onUpload,
  onRemove,
  isUploading = false,
  uploadProgress,
  error,
  address,
  size = 128,
  required = false,
}: AvatarUploadPopoverProps) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0, scale: 1 })
  const { address: wagmiAddress } = useAccount()
  const { user } = usePrivy()

  // Get the active address from either source
  const activeAddress = address || wagmiAddress || user?.wallet?.address

  // Generate consistent colors for default avatar
  const colors = useMemo(() => {
    if (!activeAddress) return { background: '#e9ecef', text: '#868e96' }

    const hash = activeAddress.slice(2, 10)
    const hue = parseInt(hash, 16) % 360
    const saturation = 70
    const lightness = 60

    return {
      background: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      text: `hsl(${hue}, ${saturation}%, 20%)`,
    }
  }, [activeAddress])

  const initials = useMemo(() => {
    if (!activeAddress) return '??'
    return `0x${activeAddress.slice(2, 4).toUpperCase()}`
  }, [activeAddress])

  // The URL is already transformed by BasicInfoSection's getImageUrl
  const displayUrl = avatarUrl

  const containerClasses = cn(
    'relative w-full h-full rounded-full overflow-hidden',
    'shadow-lg hover:shadow-xl transition-all duration-300',
    required && !displayUrl && 'ring-2 ring-github-danger-emphasis'
  )

  const borderClasses = cn('absolute inset-0 rounded-full border-4 border-white z-20')

  const defaultAvatarClasses = cn(
    'flex items-center justify-center',
    'aspect-square w-full rounded-full',
    'font-medium bg-clip-padding'
  )

  return (
    <div className='relative' style={{ width: size, height: size }}>
      {isUploading && (
        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 rounded-full'>
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

      {required && !displayUrl && (
        <div className='absolute -top-1 -right-1 w-4 h-4 bg-github-danger-emphasis rounded-full z-30 flex items-center justify-center'>
          <span className='text-white text-xs'>*</span>
        </div>
      )}

      <ImageUploadPopover
        onImageSelect={onUpload}
        currentImageUrl={displayUrl || undefined}
        onRemove={onRemove}
        onPositionSet={setPosition}
        error={error?.message}
        shape='avatar'
      >
        <div className='relative' style={{ width: size, height: size }}>
          <div className={containerClasses}>
            <div className={borderClasses} />
            {displayUrl ? (
              <div className='relative w-full h-full'>
                <div className='w-full h-full'>
                  <div className='relative w-full h-full'>
                    <Image
                      src={displayUrl}
                      alt='Avatar'
                      fill
                      className='object-cover rounded-full'
                      style={{
                        transform: `scale(${position.scale}) translate(${position.x}px, ${position.y}px)`,
                      }}
                      sizes='128px'
                      priority
                    />
                  </div>
                  <div className='absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'>
                    <div className='p-2 bg-black bg-opacity-50 rounded-full'>
                      <Camera className='w-6 h-6 text-white' />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={defaultAvatarClasses}
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                  fontSize: size * 0.3,
                  width: size,
                  height: size,
                }}
              >
                <span className='block text-center'>{initials}</span>
                {required && (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='p-2 bg-black bg-opacity-50 rounded-full'>
                      <Camera className='w-6 h-6 text-white' />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </ImageUploadPopover>
    </div>
  )
}

export default AvatarUploadPopover
