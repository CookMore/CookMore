'use client'

import { useState } from 'react'
import { IconEdit } from '@/app/api/icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/api/components/ui/popover'
import { Button } from '@/app/api/components/ui/button'
import { toast } from 'sonner'

interface ImageUploadPopoverProps {
  onImageSelect: (file: File) => Promise<void>
  children: React.ReactNode
  accept?: string
  maxSize?: number
}

export function ImageUploadPopover({
  onImageSelect,
  children,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024,
}: ImageUploadPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (maxSize && file.size > maxSize) {
      toast.error(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }

    try {
      setIsUploading(true)
      await onImageSelect(file)
      setIsOpen(false)
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Failed to upload image:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='space-y-4'>
          <div className='flex items-center space-x-2'>
            <IconEdit className='h-4 w-4' />
            <h4 className='font-medium'>Upload Image</h4>
          </div>
          <div className='relative'>
            <input
              type='file'
              accept={accept}
              onChange={handleFileChange}
              className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
              disabled={isUploading}
            />
            <Button className='w-full' disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Choose Image'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
