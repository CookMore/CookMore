'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { cn } from '@/app/api/utils/utils'
import { ImageUploadPopover } from '@/app/api/components/ui/ImageUploadPopover'
import type { UploadProgress } from '../hooks/ipfs/useIPFS'

interface AvatarContainerProps {
  avatarCID?: string
  onUpload: (file: File) => Promise<string | null>
  isUploading?: boolean
  uploadProgress?: UploadProgress | null
  error?: Error | null
  className?: string
}

interface DefaultAvatarProps {
  showShadow?: boolean
}

function DefaultAvatar({ showShadow }: DefaultAvatarProps) {
  return (
    <div
      className={cn(
        'w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center',
        showShadow && 'shadow-lg'
      )}
    >
      <span className='text-4xl text-gray-400'>👤</span>
    </div>
  )
}

export function AvatarContainer({
  avatarCID,
  onUpload,
  isUploading,
  uploadProgress,
  error,
  className,
}: AvatarContainerProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileSelect = useCallback(
    async (file: File) => {
      try {
        // Create preview URL
        const preview = URL.createObjectURL(file)
        setPreviewUrl(preview)

        // Upload file
        const cid = await onUpload(file)

        if (!cid) {
          // If upload failed, remove preview
          URL.revokeObjectURL(preview)
          setPreviewUrl(null)
        }
      } catch (err) {
        // Clean up preview on error
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
          setPreviewUrl(null)
        }

        if (err instanceof Error) {
          toast.error(err.message)
        } else {
          toast.error('Failed to upload avatar')
        }
      }
    },
    [onUpload, previewUrl]
  )

  return (
    <div className={cn('relative w-32 h-32', className)}>
      <ImageUploadPopover
        onImageSelect={handleFileSelect}
        accept='image/*'
        maxSize={5 * 1024 * 1024} // 5MB
      >
        <div className='relative w-full h-full rounded-full overflow-hidden'>
          {/* Preview or IPFS Image */}
          {(previewUrl || avatarCID) && (
            <Image
              src={previewUrl || `/api/ipfs/${avatarCID}`}
              alt='Profile avatar'
              fill
              className='object-cover'
            />
          )}

          {/* Default Avatar */}
          {!previewUrl && !avatarCID && <DefaultAvatar showShadow />}

          {/* Upload Progress Overlay */}
          {isUploading && uploadProgress && (
            <div className='absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center'>
              <div className='w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin' />
              <span className='text-white mt-2'>{Math.round(uploadProgress.progress)}%</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className='absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center'>
              <span className='text-white text-sm px-2 text-center'>{error.message}</span>
            </div>
          )}

          {/* Hover State */}
          <div className='absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center'>
            <span className='text-white opacity-0 hover:opacity-100 transition-opacity'>
              Change Avatar
            </span>
          </div>
        </div>
      </ImageUploadPopover>
    </div>
  )
}
