'use client'

import { useState } from 'react'
import { Control, useController } from 'react-hook-form'
import { FormSection } from '@/app/api/form/FormSection'
import { IconImage } from '@/app/api/icons'
import type { FreeProfileMetadata } from '@/app/[locale]/(authenticated)/profile/profile'
import { useIPFSUpload } from '../hooks/ipfs/useIPFS'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'

interface CulinaryImagesSectionProps {
  control: Control<FreeProfileMetadata>
}

export function CulinaryImagesSection({ control }: CulinaryImagesSectionProps) {
  const { hasGroup, hasPro, hasOG } = useNFTTiers()
  const [images, setImages] = useState<string[]>([])

  // Determine current tier
  const currentTier = hasOG
    ? ProfileTier.OG
    : hasGroup
      ? ProfileTier.GROUP
      : hasPro
        ? ProfileTier.PRO
        : ProfileTier.FREE

  // Function to handle image uploads
  const handleImageUpload = async (file: File) => {
    try {
      const cid = await uploadImage(file) // Assume uploadImage is a function to upload images
      setImages((prevImages) => [...prevImages, `ipfs://${cid}`])
    } catch (error) {
      console.error('Failed to upload image:', error)
    }
  }

  // Function to remove an image
  const handleImageRemove = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  return (
    <FormSection
      title='Additional Profile Photos'
      description='Upload additional photos for your profile'
      icon={IconImage}
    >
      <div className='space-y-6'>
        {images.map((image, index) => (
          <div key={index} className='flex items-center space-x-4'>
            <img
              src={image}
              alt={`Profile Photo ${index + 1}`}
              className='w-16 h-16 rounded-full'
            />
            <button onClick={() => handleImageRemove(index)} className='text-red-500'>
              Remove
            </button>
          </div>
        ))}
        <div className='flex flex-col items-center space-y-4'>
          <input
            type='file'
            onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
          />
          <span className='text-sm text-github-fg-muted'>Upload a new photo</span>
        </div>
      </div>
    </FormSection>
  )
}
