'use client'

import Image from 'next/image'
import { IconZoomIn, IconTrash } from '@/components/ui/icons'
import { useState } from 'react'

interface RecipeImageGridProps {
  imageCids: string[]
  onImageDelete?: (cid: string) => void
  onImageClick?: (cid: string) => void
  stepKey: string
}

export default function RecipeImageGrid({
  imageCids,
  onImageDelete,
  onImageClick,
  stepKey,
}: RecipeImageGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const getImageUrl = (cid: string) => `https://ipfs.io/ipfs/${cid}`

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {imageCids.map((cid, index) => (
        <div
          key={cid}
          className='relative aspect-video rounded-md overflow-hidden border border-github-border-default
                     bg-github-canvas-subtle'
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Image
            src={getImageUrl(cid)}
            alt={`Recipe image ${index + 1}`}
            fill
            className='object-cover'
          />

          {/* Hover overlay */}
          {hoveredIndex === index && (
            <div
              className='absolute inset-0 bg-github-canvas-overlay bg-opacity-50 
                          animate-fade-in flex items-center justify-center gap-2'
            >
              <button
                onClick={() => onImageClick?.(cid)}
                className='p-2 rounded-md bg-github-canvas-default hover:bg-github-canvas-subtle 
                         text-github-fg-default transition-colors'
              >
                <IconZoomIn className='w-5 h-5' />
              </button>
              {onImageDelete && (
                <button
                  onClick={() => onImageDelete(cid)}
                  className='p-2 rounded-md bg-github-danger-emphasis hover:bg-github-danger-muted 
                           text-github-fg-onEmphasis transition-colors'
                >
                  <IconTrash className='w-5 h-5' />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
