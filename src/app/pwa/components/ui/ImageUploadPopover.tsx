'use client'

import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import { useState, useRef, useEffect } from 'react'
import { IconCamera, IconX, IconMove, IconDefaultAvatar, IconZoomIn, IconZoomOut } from './icons'
import { Button } from '@/components/ui/button'

interface ImageUploadPopoverProps {
  onImageSelect: (file: File) => void
  currentImageUrl?: string
  onRemove?: () => void
  onPositionSet?: (position: { x: number; y: number; scale: number }) => void
  isLoading?: boolean
  error?: string
  position: { x: number; y: number; scale: number }
}

export function ImageUploadPopover({
  onImageSelect,
  currentImageUrl,
  onRemove,
  onPositionSet,
  isLoading = false,
  error,
  position: initialPosition,
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

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger className='relative w-20 h-20 rounded-full overflow-hidden bg-github-canvas-subtle'>
        {currentImageUrl ? (
          <div className='relative w-full h-full'>
            <img
              src={currentImageUrl}
              alt='Profile'
              className='absolute w-[200%] h-[200%] max-w-none object-cover'
              style={{
                transform: `translate(${getScaledPosition(position, true).x}px, ${
                  getScaledPosition(position, true).y
                }px) scale(${position.scale})`,
                left: '-50%',
                top: '-50%',
                transformOrigin: 'center center',
              }}
            />
            <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
              <IconCamera className='w-5 h-5 text-white' />
            </div>
          </div>
        ) : (
          <IconDefaultAvatar className='w-8 h-8 text-github-fg-muted group-hover:text-github-fg-default' />
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/50' style={{ zIndex: 9998 }} />
        <Dialog.Content
          className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                   w-[90vw] max-w-[400px] rounded-lg border border-github-border-default 
                   bg-github-canvas-default shadow-lg'
          style={{ zIndex: 9999 }}
        >
          <div className='p-4'>
            <div className='flex justify-between items-center mb-4'>
              <Dialog.Title className='text-sm font-medium text-github-fg-default'>
                Profile Image
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

            <div className='relative w-full aspect-square mb-4 bg-github-canvas-subtle rounded-lg overflow-hidden'>
              {currentImageUrl ? (
                <div className='relative w-full h-full'>
                  <div className='absolute inset-0 bg-black/80' />

                  <div className='absolute inset-8'>
                    <div
                      className='relative w-full h-full rounded-full overflow-hidden'
                      onMouseDown={handleMouseDown}
                      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    >
                      <img
                        ref={imageRef}
                        src={currentImageUrl}
                        alt='Profile'
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
                      className={`absolute inset-0 rounded-full border-2 
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
                if (file) onImageSelect(file)
              }}
            />

            <div className='space-y-3'>
              <Button variant='secondary' className='w-full' onClick={handleSetImage}>
                Set Profile Image
              </Button>
              {onRemove && (
                <Button
                  variant='outline'
                  className='w-full text-github-danger-fg hover:text-github-danger-emphasis'
                  onClick={() => {
                    onRemove()
                    setPosition({ x: 0, y: 0, scale: 1 })
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
