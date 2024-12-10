'use client'

import { useState } from 'react'
import { IconCamera } from '@/components/ui/icons'
import { DefaultAvatar } from '@/components/ui/DefaultAvatar'
import { ImageUploadPopover } from '@/components/ui/ImageUploadPopover'
import { cn } from '@/lib/utils'

interface AvatarContainerProps {
  imageUrl?: string | null
  name?: string
  size?: 'xs' | 'base' | 'sm' | 'md' | 'lg'
  shape?: 'circle' | 'square' | 'banner'
  onImageSelect: (file: File) => void
  onImagePositionSet?: (position: { x: number; y: number; scale: number }) => void
  onImageRemove?: () => void
  label?: string
  maxSize?: number // in MB
  isGallery?: boolean // New prop to handle gallery mode
  showCamera?: boolean // Add this prop
  loading?: boolean
  required?: boolean
}

const sizeClasses = {
  xs: 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20',
  base: 'w-20 h-20',
  sm: 'w-24 h-24',
  md: 'w-32 h-32',
  lg: 'w-40 h-40',
}

export function AvatarContainer({
  imageUrl,
  name,
  size = 'md',
  shape = 'circle',
  onImageSelect,
  onImagePositionSet,
  onImageRemove,
  label,
  maxSize = 5,
  isGallery = false,
  showCamera = false,
  loading = false,
  required = false,
}: AvatarContainerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0, scale: 1 })
  const [galleryImages, setGalleryImages] = useState<(string | null)[]>([null, null, null])
  const [galleryPositions, setGalleryPositions] = useState([
    { x: 0, y: 0, scale: 1 },
    { x: 0, y: 0, scale: 1 },
    { x: 0, y: 0, scale: 1 },
  ])

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

  const handleGalleryImageSelect = (index: number, file: File) => {
    const url = URL.createObjectURL(file)
    const newImages = [...galleryImages]
    newImages[index] = url
    setGalleryImages(newImages)
    console.log(`Gallery image ${index + 1} selected:`, url)
  }

  const handleGalleryPositionSet = (
    index: number,
    newPosition: { x: number; y: number; scale: number }
  ) => {
    const newPositions = [...galleryPositions]
    newPositions[index] = newPosition
    setGalleryPositions(newPositions)
    console.log(`Gallery image ${index + 1} position set:`, newPosition)
  }

  // Add loading overlay
  const LoadingOverlay = () => (
    <div className='absolute inset-0 bg-github-canvas-default/80 flex items-center justify-center'>
      <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-github-accent-emphasis' />
    </div>
  )

  if (isGallery) {
    return (
      <div className='grid grid-cols-3 gap-2'>
        {[0, 1, 2].map((index) => (
          <div key={index} className='flex flex-col items-center space-y-1'>
            <ImageUploadPopover
              onImageSelect={(file) => handleGalleryImageSelect(index, file)}
              currentImageUrl={galleryImages[index] || undefined}
              onRemove={() => {
                const newImages = [...galleryImages]
                newImages[index] = null
                setGalleryImages(newImages)
              }}
              onPositionSet={(pos) => handleGalleryPositionSet(index, pos)}
              position={galleryPositions[index]}
              shape='square'
              maxSize={maxSize}
            >
              <div
                className={`
                  relative ${sizeClasses['xs']}
                  group cursor-pointer
                  hover:ring-2 hover:ring-github-accent-emphasis
                  hover:ring-offset-2 hover:ring-offset-github-canvas-default
                  transition-all duration-200
                  bg-github-canvas-subtle
                  overflow-hidden
                  rounded-lg
                `}
              >
                <div className='relative w-full h-full overflow-hidden'>
                  {galleryImages[index] ? (
                    <img
                      src={galleryImages[index]!}
                      alt={`Gallery ${index + 1}`}
                      className='object-cover'
                      style={{
                        transform: `translate(${galleryPositions[index].x}px, ${galleryPositions[index].y}px) scale(${galleryPositions[index].scale})`,
                        width: '200%',
                        height: '200%',
                        maxWidth: 'none',
                        position: 'absolute',
                        left: '-50%',
                        top: '-50%',
                        transformOrigin: 'center center',
                      }}
                    />
                  ) : (
                    <DefaultAvatar
                      name={`Gallery ${index + 1}`}
                      className='w-full h-full rounded-lg'
                    />
                  )}
                </div>

                <div
                  className='absolute inset-0 bg-black/50 flex items-center justify-center 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                >
                  <IconCamera className='w-8 h-8 text-white' />
                </div>
              </div>
            </ImageUploadPopover>
            <span className='text-[10px] sm:text-xs text-github-fg-muted'>Image {index + 1}</span>
          </div>
        ))}
      </div>
    )
  }

  // Original single avatar code
  return (
    <div className='space-y-2'>
      <ImageUploadPopover
        onImageSelect={onImageSelect}
        currentImageUrl={imageUrl || undefined}
        onRemove={onImageRemove}
        onPositionSet={(pos) => {
          setPosition(pos)
          onImagePositionSet?.(pos)
        }}
        position={position}
        shape={shape}
        maxSize={maxSize}
        disabled={loading}
      >
        <div
          className={cn(
            'relative',
            sizeClasses[size],
            'group cursor-pointer',
            'hover:ring-2 hover:ring-github-accent-emphasis',
            'hover:ring-offset-2 hover:ring-offset-github-canvas-default',
            'transition-all duration-200',
            'bg-github-canvas-subtle',
            'overflow-hidden',
            shape === 'circle' ? 'rounded-full' : 'rounded-lg',
            loading && 'cursor-wait'
          )}
        >
          <div className='relative w-full h-full overflow-hidden'>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name || 'Image'}
                className='object-cover'
                style={getImageStyle()}
              />
            ) : showCamera ? (
              <div className='flex items-center justify-center w-full h-full'>
                <IconCamera className='w-6 h-6 text-github-fg-muted' />
              </div>
            ) : (
              <DefaultAvatar
                name={name}
                className={`w-full h-full ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
              />
            )}
          </div>

          {loading ? (
            <LoadingOverlay />
          ) : (
            <div
              className='absolute inset-0 bg-black/50 flex items-center justify-center 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200'
            >
              <IconCamera className='w-8 h-8 text-white' />
            </div>
          )}
        </div>
      </ImageUploadPopover>
      {label && (
        <div className='flex items-center justify-center'>
          <span className='text-sm text-github-fg-muted'>
            {label}
            {required && <span className='text-github-danger-fg ml-1'>*</span>}
          </span>
        </div>
      )}
    </div>
  )
}
