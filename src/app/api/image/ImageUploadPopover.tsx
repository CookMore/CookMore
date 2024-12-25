'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Camera, X, MoveIcon, User, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/app/api/components/ui/button'
import { toast } from '@/app/api/toast'
import { useDropzone } from 'react-dropzone'
import { ipfsService } from '@/app/[locale]/(authenticated)/profile/services/ipfs/ipfs.service'
import { cn } from '@/app/api/utils/utils'

interface ImageUploadPopoverProps {
  onImageSelect: (file: File) => void
  currentImageUrl?: string
  onRemove?: () => void
  onPositionSet?: (position: { x: number; y: number; scale: number }) => void
  isLoading?: boolean
  error?: string
  position?: { x: number; y: number; scale: number }
  accept?: string
  maxSize?: number
  shape?: 'avatar' | 'banner'
  disabled?: boolean
  children?: React.ReactNode
}

export function ImageUploadPopover({
  onImageSelect,
  currentImageUrl,
  onRemove,
  onPositionSet,
  isLoading = false,
  error,
  position: initialPosition,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024,
  shape = 'avatar',
  disabled = false,
  children,
}: ImageUploadPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0, scale: 1 })
  const dragRef = useRef<{ startX: number; startY: number }>({ startX: 0, startY: 0 })
  const imageRef = useRef<HTMLImageElement>(null)
  const fileRef = useRef<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Convert IPFS URL to HTTP URL if needed
  const displayUrl = currentImageUrl ? ipfsService.getHttpUrl(currentImageUrl) : undefined
  console.log('ImageUploadPopover - URL transformation:', {
    input: currentImageUrl,
    output: displayUrl,
    isOpen,
    hasPreview: !!previewUrl,
  })

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      console.log('ImageUploadPopover - File dropped:', {
        name: file.name,
        size: file.size,
        type: file.type,
      })
      // Create preview URL first
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)
      setIsOpen(true)
      // Store file for later upload
      fileRef.current = file
      console.log('ImageUploadPopover - Preview created:', {
        preview,
        isOpen: true,
      })
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize,
    disabled: isLoading || disabled,
    multiple: false,
  })

  // Reset position when dialog opens
  useEffect(() => {
    if (isOpen) {
      setPosition(initialPosition || { x: 0, y: 0, scale: 1 })
    }
  }, [isOpen, initialPosition])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    dragRef.current = {
      startX: e.clientX - position.x,
      startY: e.clientY - position.y,
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    e.stopPropagation()
    const newX = e.clientX - dragRef.current.startX
    const newY = e.clientY - dragRef.current.startY

    // Calculate boundaries to ensure image covers the entire container
    const imageEl = imageRef.current
    if (!imageEl) return

    const containerWidth = imageEl.parentElement?.clientWidth || 0
    const containerHeight = imageEl.parentElement?.clientHeight || 0
    const imageWidth = imageEl.clientWidth * position.scale
    const imageHeight = imageEl.clientHeight * position.scale

    // Calculate max drag distances to keep image covering container
    const maxX = Math.max(0, (imageWidth - containerWidth) / 2)
    const maxY = Math.max(0, (imageHeight - containerHeight) / 2)

    // Clamp the position values
    const clampedX = Math.min(Math.max(newX, -maxX), maxX)
    const clampedY = Math.min(Math.max(newY, -maxY), maxY)

    setPosition((prev) => ({ ...prev, x: clampedX, y: clampedY }))
  }

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  // Remove zoom functionality
  const handleZoom = undefined

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove, { passive: false })
      window.addEventListener('mouseup', handleMouseUp, { passive: false })
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const handleSetImage = () => {
    if (fileRef.current) {
      console.log('ImageUploadPopover - Setting image:', {
        fileName: fileRef.current.name,
        fileSize: fileRef.current.size,
        position,
      })
      onImageSelect(fileRef.current)
      if (onPositionSet) {
        onPositionSet(position)
      }
      setIsOpen(false)
    }
  }

  const getScaledPosition = (pos: { x: number; y: number; scale: number }, isPreview: boolean) => {
    const scaleFactor = isPreview ? 0.5 : 1
    return {
      x: pos.x * scaleFactor,
      y: pos.y * scaleFactor,
      scale: pos.scale,
    }
  }

  const handleFileSelect = (file: File) => {
    if (maxSize && file.size > maxSize) {
      toast.error(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }
    onImageSelect(file)
  }

  const containerClassName =
    shape === 'banner'
      ? 'w-full aspect-[3/1] rounded-lg overflow-hidden'
      : 'w-full h-full rounded-full overflow-hidden'

  const imageContainerClassName =
    shape === 'banner'
      ? 'absolute inset-0 w-full h-full'
      : 'absolute inset-0 rounded-full overflow-hidden'

  const imageClassName = cn(
    'object-cover w-full h-full',
    shape === 'avatar' && 'rounded-full',
    isDragging ? 'cursor-grabbing' : 'cursor-grab'
  )

  // Clean up preview URL when dialog closes
  useEffect(() => {
    if (!isOpen && previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }, [isOpen, previewUrl])

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <div
          className={cn('cursor-pointer', containerClassName)}
          onDragStart={(e) => e.preventDefault()}
        >
          {children}
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/50' style={{ zIndex: 9998 }} />
        <Dialog.Content
          className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                    w-[90vw] max-w-[450px] rounded-lg border border-github-border-default 
                    bg-github-canvas-default shadow-lg'
          style={{ zIndex: 9999 }}
        >
          <div className='p-4'>
            <div className='flex justify-between items-center mb-4'>
              <Dialog.Title className='text-sm font-medium text-github-fg-default'>
                {shape === 'banner' ? 'Banner Image' : 'Profile Image'}
              </Dialog.Title>
              <Dialog.Description className='sr-only'>
                {shape === 'banner'
                  ? 'Upload and adjust your banner image. You can drag to reposition.'
                  : 'Upload and adjust your profile picture. You can drag to reposition.'}
              </Dialog.Description>
              <Dialog.Close className='text-github-fg-muted hover:text-github-fg-default'>
                <X className='w-4 h-4' />
              </Dialog.Close>
            </div>

            <div {...getRootProps()} className='relative mb-4'>
              <input {...getInputProps()} />
              <div
                className={cn(
                  'relative bg-github-canvas-subtle overflow-hidden',
                  shape === 'avatar'
                    ? 'aspect-square w-[300px] mx-auto rounded-full'
                    : 'aspect-[3/1] w-full rounded-lg'
                )}
              >
                {previewUrl ? (
                  <div className='relative w-full h-full'>
                    <div className='absolute inset-0 bg-black/90' />
                    <div className={imageContainerClassName}>
                      <div
                        className={cn(
                          'relative w-full h-full overflow-hidden',
                          shape === 'avatar' && 'rounded-full'
                        )}
                        onMouseDown={handleMouseDown}
                        onDragStart={(e) => e.preventDefault()}
                      >
                        <Image
                          ref={imageRef}
                          src={previewUrl}
                          alt={shape === 'banner' ? 'Banner' : 'Profile'}
                          fill
                          className={imageClassName}
                          style={{
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            transformOrigin: 'center center',
                            pointerEvents: isDragging ? 'none' : 'auto',
                          }}
                          draggable={false}
                          sizes={shape === 'banner' ? '100vw' : '300px'}
                          priority
                          onLoad={(e) => {
                            // Set initial scale to ensure image covers container
                            const img = e.target as HTMLImageElement
                            const container = img.parentElement
                            if (!container) return

                            const containerAspect = container.clientWidth / container.clientHeight
                            const imageAspect = img.naturalWidth / img.naturalHeight

                            const scale =
                              containerAspect > imageAspect
                                ? container.clientWidth / img.naturalWidth
                                : container.clientHeight / img.naturalHeight

                            setPosition((prev) => ({ ...prev, scale: Math.max(1.2, scale) }))
                          }}
                        />
                      </div>
                      <div
                        className={cn(
                          'absolute inset-0 pointer-events-none transition-colors',
                          shape === 'avatar' && 'rounded-full',
                          isDragging ? 'border-github-accent-emphasis' : 'border-white/30'
                        )}
                      >
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <div
                            className={cn(
                              'bg-black/20 p-4',
                              shape === 'avatar' ? 'rounded-full' : 'rounded-lg'
                            )}
                          >
                            <MoveIcon
                              className={`w-8 h-8 ${
                                isDragging ? 'text-github-accent-emphasis' : 'text-white/50'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      'flex flex-col items-center justify-center h-full space-y-3 cursor-pointer',
                      shape === 'avatar' && 'rounded-full'
                    )}
                  >
                    <Camera className='w-12 h-12 text-gray-400' />
                    <span className='text-base text-gray-500'>
                      {isDragActive ? 'Drop image here' : 'Click or drag to upload'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className='flex justify-end gap-2'>
              {onRemove && currentImageUrl && (
                <Button
                  variant='destructive'
                  onClick={onRemove}
                  disabled={isLoading || disabled}
                  className='mr-auto'
                >
                  Remove
                </Button>
              )}
              <Dialog.Close asChild>
                <Button variant='secondary'>Cancel</Button>
              </Dialog.Close>
              {previewUrl && (
                <Button onClick={handleSetImage} disabled={isLoading || disabled}>
                  Set Image
                </Button>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
