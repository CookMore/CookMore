'use client'

import { useState } from 'react'
import { useContractWrite, useContractRead } from 'wagmi'
import { uploadToIPFS } from '@/lib/ipfs' // We'll need to create this
import { IconZoomIn, IconTrash } from '@/app/api/icons'
import Image from 'next/image'
import { RECIPE_NFT_ABI, RECIPE_NFT_ADDRESS } from '@/constants/contracts'

interface RecipeImageUploadProps {
  recipeId?: number // Optional - only needed for updates
  onUploadComplete?: (metadataURI: string) => void
  className?: string
}

export default function RecipeImageUpload({
  recipeId,
  onUploadComplete,
  className = '',
}: RecipeImageUploadProps) {
  const [imageHash, setImageHash] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  // Contract interactions
  const { write: createRecipe } = useContractWrite({
    address: RECIPE_NFT_ADDRESS,
    abi: RECIPE_NFT_ABI,
    functionName: 'createRecipe',
  })

  const { write: updateRecipe } = useContractWrite({
    address: RECIPE_NFT_ADDRESS,
    abi: RECIPE_NFT_ABI,
    functionName: 'updateRecipeMetadata',
  })

  // Handle file upload
  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true)

      // 1. Upload image to IPFS
      const imageHash = await uploadToIPFS(file)
      setImageHash(imageHash)

      // 2. Create metadata object
      const metadata = {
        name: 'Recipe Image',
        description: 'Recipe image uploaded to IPFS',
        image: `ipfs://${imageHash}`,
      }

      // 3. Upload metadata to IPFS
      const metadataHash = await uploadToIPFS(JSON.stringify(metadata))
      const metadataURI = `ipfs://${metadataHash}`

      // 4. Interact with smart contract
      if (recipeId) {
        // Update existing recipe
        updateRecipe({ args: [recipeId, metadataURI] })
      } else {
        // Create new recipe
        createRecipe({ args: [metadataURI] })
      }

      onUploadComplete?.(metadataURI)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {imageHash ? (
        <div
          className='relative aspect-video rounded-md overflow-hidden 
                      border border-github-border-default'
        >
          <Image
            src={`https://ipfs.io/ipfs/${imageHash}`}
            alt='Recipe image'
            fill
            className='object-cover'
          />
          <div className='absolute top-2 right-2 flex gap-2'>
            <button
              onClick={() => window.open(`https://ipfs.io/ipfs/${imageHash}`, '_blank')}
              className='p-1.5 rounded-md bg-github-canvas-default 
                       hover:bg-github-canvas-subtle text-github-fg-default 
                       transition-colors'
            >
              <IconZoomIn className='w-5 h-5' />
            </button>
            <button
              onClick={() => setImageHash('')}
              className='p-1.5 rounded-md bg-github-danger-emphasis 
                       hover:bg-github-danger-muted text-github-fg-onEmphasis 
                       transition-colors'
            >
              <IconTrash className='w-5 h-5' />
            </button>
          </div>
        </div>
      ) : (
        <div
          className='w-full aspect-video rounded-md border-2 border-dashed 
                      border-github-border-default bg-github-canvas-subtle 
                      flex items-center justify-center'
        >
          <input
            type='file'
            accept='image/*'
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file)
            }}
            className='hidden'
            id='recipe-image-upload'
          />
          <label
            htmlFor='recipe-image-upload'
            className='cursor-pointer px-4 py-2 rounded-md 
                     bg-github-btn-bg hover:bg-github-btn-hover 
                     text-github-fg-default transition-colors'
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </label>
        </div>
      )}
    </div>
  )
}
