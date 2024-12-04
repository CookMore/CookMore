'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useState, useRef, useEffect } from 'react'
import { IconCamera, IconX, IconMove, IconDefaultAvatar, IconZoomIn, IconZoomOut } from './icons'
import { Button } from './button'

interface ImageUploadPopoverProps {
  onImageSelect: (file: File) => void
  currentImageUrl?: string
  onRemove?: () => void
  onPositionSet?: (position: { x: number; y: number; scale: number }) => void
  isLoading?: boolean
  error?: string
  position: { x: number; y: number; scale: number }
  children?: React.ReactNode
  shape?: 'circle' | 'square' | 'banner'
  maxSize?: number // in MB
}

export function ImageUploadPopover({
  onImageSelect,
  currentImageUrl,
  onRemove,
  onPositionSet,
  isLoading = false,
  error,
  position: initialPosition,
  children,
  shape = 'circle',
  maxSize = 5,
}: ImageUploadPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(initialPosition)
  const dragRef = useRef<{ startX: number; startY: number }>({ startX: 0, startY: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Reset position when dialog opens
  useEffect(() => {
    if (isOpen) {
      setPosition(initialPosition)
    }
  }, [isOpen, initialPosition])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    dragRef.current = {
      startX: e.clientX - position.x,
      startY: e.clientY - position.y,
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    const newX = e.clientX - dragRef.current.startX
    const newY = e.clientY - dragRef.current.startY
    setPosition((prev) => ({ ...prev, x: newX, y: newY }))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add zoom controls
  const handleZoom = (zoomIn: boolean) => {
    setPosition((prev) => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale + (zoomIn ? 0.1 : -0.1), 0.5), 2),
    }))
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const handleSetImage = () => {
    console.log('Setting image:', {
      url: currentImageUrl,
      position,
      shape,
    })
    onPositionSet?.(position)
    setIsOpen(false)
  }

  // Calculate scaled position for the preview
  const getScaledPosition = (pos: { x: number; y: number; scale: number }, isPreview: boolean) => {
    // Preview (trigger button) is smaller than edit view, so scale positions accordingly
    const scaleFactor = isPreview ? 0.5 : 1 // Adjust this value based on size difference
    return {
      x: pos.x * scaleFactor,
      y: pos.y * scaleFactor,
      scale: pos.scale,
    }
  }

  const handleFileSelect = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      // TODO: Add error handling
      console.error(`File size must be less than ${maxSize}MB`)
      return
    }
    onImageSelect(file)
  }

  const getShapeClasses = () => {
    switch (shape) {
      case 'square':
        return 'rounded-lg'
      case 'banner':
        return 'rounded-lg aspect-[3/1]' // 3:1 aspect ratio for banner
      default:
        return 'rounded-full'
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/50' style={{ zIndex: 9998 }} />
        <Dialog.Content
          className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                   w-[90vw] max-w-[400px] rounded-lg border border-github-border-default 
                   bg-github-canvas-default shadow-lg'
          style={{ zIndex: 9999 }}
          aria-describedby='dialog-description'
        >
          <Dialog.Description id='dialog-description' className='sr-only'>
            Upload and crop your image
          </Dialog.Description>
          <div className='p-4'>
            <div className='flex justify-between items-center mb-4'>
              <Dialog.Title className='text-sm font-medium text-github-fg-default'>
                {shape === 'banner' ? 'Banner Image' : 'Profile Image'}
              </Dialog.Title>
              {currentImageUrl && (
                <div className='flex items-center gap-2 mr-4'>
                  <button
                    onClick={() => handleZoom(false)}
                    className='p-1 rounded hover:bg-github-canvas-subtle text-github-fg-muted'
                    disabled={position.scale <= 0.5}
                  >
                    <IconZoomOut className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() => handleZoom(true)}
                    className='p-1 rounded hover:bg-github-canvas-subtle text-github-fg-muted'
                    disabled={position.scale >= 2}
                  >
                    <IconZoomIn className='w-4 h-4' />
                  </button>
                </div>
              )}
              <Dialog.Close className='text-github-fg-muted hover:text-github-fg-default'>
                <IconX className='w-4 h-4' />
              </Dialog.Close>
            </div>

            <div
              className={`relative w-full ${
                shape === 'banner' ? 'aspect-[3/1]' : 'aspect-square'
              } mb-4 bg-github-canvas-subtle rounded-lg overflow-hidden`}
            >
              {currentImageUrl ? (
                <div className='relative w-full h-full'>
                  <div className='absolute inset-0 bg-black/80' />

                  <div className={`absolute ${shape === 'banner' ? 'inset-4' : 'inset-8'}`}>
                    <div
                      className={`relative w-full h-full ${getShapeClasses()} overflow-hidden`}
                      onMouseDown={handleMouseDown}
                      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    >
                      <img
                        ref={imageRef}
                        src={currentImageUrl}
                        alt='Image'
                        className='absolute w-[200%] h-[200%] max-w-none object-cover'
                        style={{
                          transform: `translate(${position.x}px, ${position.y}px) scale(${position.scale})`,
                          left: '-50%',
                          top: '-50%',
                          transformOrigin: 'center center',
                        }}
                        draggable={false}
                      />
                    </div>
                    <div
                      className={`absolute inset-0 ${getShapeClasses()} border-2 
                        ${isDragging ? 'border-github-accent-emphasis' : 'border-white/30'} 
                        pointer-events-none transition-colors`}
                    >
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <IconMove
                          className={`w-8 h-8 ${
                            isDragging ? 'text-github-accent-emphasis' : 'text-white/50'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className='h-full flex flex-col items-center justify-center cursor-pointer'
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IconCamera className='w-12 h-12 text-github-fg-muted mb-2' />
                  <p className='text-sm text-github-fg-muted'>Click to choose an image</p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type='file'
              className='hidden'
              accept='image/*'
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
              }}
            />

            <div className='space-y-3 p-4'>
              <Button variant='secondary' className='w-full' onClick={handleSetImage}>
                Set {shape === 'banner' ? 'Banner' : 'Profile'} Image
              </Button>
              {onRemove && (
                <Button
                  variant='outline'
                  className='w-full text-github-danger-fg hover:text-github-danger-emphasis'
                  onClick={() => {
                    console.log('Removing image')
                    onRemove()
                    setPosition({ x: 0, y: 0, scale: 1 })
                  }}
                >
                  Remove
                </Button>
              )}

              <div className='mt-4 pt-4 border-t border-github-border-default'>
                <div className='text-xs text-github-fg-muted'>Image Settings</div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
