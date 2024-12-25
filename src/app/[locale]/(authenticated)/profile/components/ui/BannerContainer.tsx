'use client'

import { useState } from 'react'
import { Camera } from 'lucide-react'
import Image from 'next/image'
import { ImageUploadPopover } from '@/app/api/image/ImageUploadPopover'
import { ipfsService } from '@/app/[locale]/(authenticated)/profile/services/ipfs/ipfs.service'
import type { UploadProgress } from '../hooks/ipfs/useIPFS'

interface Position {
  x: number
  y: number
  scale: number
}

interface BannerContainerProps {
  imageUrl: string | null
  onImageSelect: (file: File) => Promise<string | null>
  onImageRemove?: () => void
  loading?: boolean
  error?: string
  uploadProgress?: UploadProgress | null
  theme?: 'default' | 'neo' | 'wooden' | 'steel' | 'copper'
}

export function BannerContainer({
  imageUrl,
  onImageSelect,
  onImageRemove,
  loading = false,
  error,
  uploadProgress,
  theme = 'default',
}: BannerContainerProps) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0, scale: 1 })

  // Convert IPFS URL to HTTP URL if needed
  const displayUrl = imageUrl?.startsWith('ipfs://')
    ? `https://gateway.pinata.cloud/ipfs/${imageUrl.replace('ipfs://', '')}`
    : imageUrl

  const containerClasses = `relative w-full h-48 rounded-lg overflow-hidden ${
    theme === 'neo'
      ? 'bg-gray-800'
      : theme === 'wooden'
        ? 'bg-amber-900'
        : theme === 'steel'
          ? 'bg-slate-800'
          : theme === 'copper'
            ? 'bg-orange-900'
            : 'bg-github-canvas-default'
  }`

  return (
    <div className={containerClasses}>
      {loading && (
        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10'>
          <div className='text-white text-center'>
            <div className='mb-2'>Uploading...</div>
            {uploadProgress && (
              <div className='w-48 h-2 bg-gray-700 rounded-full overflow-hidden'>
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
        onImageSelect={onImageSelect}
        currentImageUrl={displayUrl}
        onRemove={onImageRemove}
        onPositionSet={(pos: Position) => {
          setPosition(pos)
        }}
        error={error}
        shape='banner'
      >
        <div className='w-full h-48 flex items-center justify-center cursor-pointer group'>
          <div className='relative w-full h-full'>
            <div className='absolute inset-0 rounded-lg border border-github-border-muted group-hover:border-2 group-hover:border-blue-500 transition-all z-10' />
            {displayUrl ? (
              <div className='relative w-full h-full'>
                <div className='relative w-full h-full'>
                  <Image
                    src={displayUrl}
                    alt='Banner'
                    fill
                    className='object-cover rounded-lg'
                    style={{
                      transform: `scale(${position.scale}) translate(${position.x}px, ${position.y}px)`,
                    }}
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    priority
                  />
                  <div className='absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'>
                    <div className='p-3 bg-black bg-opacity-50 rounded-lg'>
                      <Camera className='w-8 h-8 text-white' />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center h-full space-y-3 bg-github-canvas-subtle rounded-lg'>
                <Camera className='w-12 h-12 text-github-fg-muted' />
                <span className='text-base text-github-fg-muted'>Click to upload banner image</span>
              </div>
            )}
          </div>
        </div>
      </ImageUploadPopover>
    </div>
  )
}
