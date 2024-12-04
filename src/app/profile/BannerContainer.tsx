'use client'

import { useState } from 'react'
import { IconCamera } from '@/components/ui/icons'
import { ImageUploadPopover } from '@/components/ui/ImageUploadPopover'
import { Tooltip } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface BannerContainerProps {
  imageUrl?: string | null
  onImageSelect: (file: File) => void
  onImagePositionSet?: (position: { x: number; y: number; scale: number }) => void
  onImageRemove?: () => void
  loading?: boolean
}

export function BannerContainer({
  imageUrl,
  onImageSelect,
  onImagePositionSet,
  onImageRemove,
  loading = false,
}: BannerContainerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0, scale: 1 })

  const getImageStyle = () => ({
    transform: `translate(${position.x}px, ${position.y}px) scale(${position.scale})`,
    width: '200%',
    height: '200%',
    maxWidth: 'none',
    position: 'absolute' as const,
    left: '-50%',
    top: '-50%',
    transformOrigin: 'center center',
  })

  // Add loading overlay
  const LoadingOverlay = () => (
    <div className='absolute inset-0 bg-github-canvas-default/80 flex items-center justify-center'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-github-accent-emphasis' />
    </div>
  )

  return (
    <ImageUploadPopover
      onImageSelect={onImageSelect}
      currentImageUrl={imageUrl || undefined}
      onRemove={onImageRemove}
      onPositionSet={(pos) => {
        setPosition(pos)
        onImagePositionSet?.(pos)
      }}
      position={position}
      shape='banner'
      maxSize={10}
      disabled={loading}
    >
      <div
        className={cn(
          'relative w-full h-48 sm:h-64',
          'group cursor-pointer',
          'hover:ring-2 hover:ring-github-accent-emphasis',
          'hover:ring-offset-2 hover:ring-offset-github-canvas-default',
          'transition-all duration-200',
          'bg-github-canvas-subtle',
          'overflow-hidden rounded-lg',
          loading && 'cursor-wait'
        )}
      >
        <div className='relative w-full h-full overflow-hidden'>
          {imageUrl ? (
            <img src={imageUrl} alt='Banner' className='object-cover' style={getImageStyle()} />
          ) : (
            <div className='flex items-center justify-center w-full h-full'>
              <IconCamera className='w-8 h-8 text-github-fg-muted' />
            </div>
          )}
        </div>

        {loading ? (
          <LoadingOverlay />
        ) : (
          <div
            className='absolute inset-0 bg-black/50 flex items-center justify-center 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200'
          >
            <IconCamera className='w-12 h-12 text-white' />
          </div>
        )}
      </div>
    </ImageUploadPopover>
  )
}
