'use client'

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/app/api/components/ui/Dialog'
import { Button } from '@/app/api/components/ui/button'
import { cn } from '@/app/api/utils/utils'
import { IconUser, IconCertificate, IconCurrencyEthereum } from '@/app/api/icons/index'
import { tierInfo } from '@/app/api/tiers/tiers'
import { recipeIpfsService } from '@/app/[locale]/(authenticated)/recipe/services/ipfs/recipe.ipfs.service'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { decodeRecipeEvent } from '@/app/api/blockchain/utils/recipe.eventDecoder'
import { RecipeMetadataService } from '@/app/[locale]/(authenticated)/recipe/services/client/recipe.metadata.service'
import { RecipeContractService } from '@/app/[locale]/(authenticated)/recipe/services/client/recipe.contract.service'
import { toast } from 'sonner'
import { usePrivy } from '@privy-io/react-auth'
import Image from 'next/image'
import { RecipeMetadataTransformer } from '@/app/[locale]/(authenticated)/recipe/services/transformers/recipe.metadata.transformer'
import { ipfsService } from '../../profile/services/ipfs/ipfs.service'
import { MetadataTransformer } from '../../profile/services/transformers/metadata.transformer'
import { RecipeMetaData, RecipeData } from '../validations/recipe'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'

interface RecipeMintProps {
  isOpen: boolean
  onClose: () => void
  formData?: RecipeFormData
  onComplete?: () => Promise<void>
  canMint?: boolean
  embedded?: boolean
  showHeader?: boolean
  tier?: ProfileTier
}

const FallbackSkeleton = () => (
  <div className='flex items-center justify-center h-full'>
    <div className='text-center'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-github-accent-fg mb-2'></div>
      <p className='text-github-fg-default'>Loading...</p>
    </div>
  </div>
)

export function RecipeMint({
  isOpen,
  onClose,
  formData = {
    basicInfo: { image: '', title: '', description: '' },
    version: '1.0',
  },
  onComplete,
  canMint,
  embedded,
  showHeader,
  tier = ProfileTier.FREE,
}: RecipeMintProps) {
  const [isMinting, setIsMinting] = useState(false)
  const [isPreviewMounted, setIsPreviewMounted] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const [canActuallyMint, setCanActuallyMint] = useState(false)
  const previewMountedRef = useRef(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const { connectWallet, authenticated } = usePrivy()

  // Handle preview mount
  useEffect(() => {
    if (isOpen && !previewMountedRef.current) {
      const checkPreviewElement = () => {
        if (previewRef.current) {
          previewMountedRef.current = true
          setIsPreviewMounted(true)
        } else {
          requestAnimationFrame(checkPreviewElement)
        }
      }
      checkPreviewElement()
    }
  }, [isOpen])

  // Reset mount state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      previewMountedRef.current = false
      setIsPreviewMounted(false)
    }
  }, [isOpen])

  // Memoize the computation of canActuallyMint
  const canActuallyMintValue = useMemo(() => {
    const hasRequiredFields = Boolean(
      formData?.basicInfo?.title && formData?.basicInfo?.description
    )
    return Boolean(canMint && hasRequiredFields && isPreviewMounted)
  }, [formData, canMint, isPreviewMounted])

  // Update canActuallyMint only if the value changes
  useEffect(() => {
    if (canActuallyMint !== canActuallyMintValue) {
      setCanActuallyMint(canActuallyMintValue)
    }
  }, [canActuallyMintValue, canActuallyMint])

  const handleMint = async () => {
    if (!isAuthenticated || !canActuallyMint) return

    setIsMinting(true)
    try {
      if (!authenticated || !user?.wallet) {
        console.log('User not authenticated or wallet not connected. Connecting wallet...')
        await connectWallet()
      }

      console.log('Data for IPFS upload:', formData)

      // Simplified formData processing
      const updatedFormData = {
        ...formData,
        ingredients: {
          ...formData.ingredients,
          types: (formData.ingredients?.types || []).filter((type: string) =>
            ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'].includes(type)
          ),
        },
        method: {
          ...formData.method,
          difficulty: ['easy', 'medium', 'hard'].includes(formData.method?.difficulty)
            ? formData.method.difficulty
            : 'easy',
        },
      }

      // Check for tier-based conditions
      if (tier === ProfileTier.FREE) {
        console.log('Applying platform fee for free tier')
        // Implement logic to handle platform fee
      }

      // Use the updated formData for the generateStaticPreview function
      const staticImage = await RecipeMetadataService.generateStaticPreview(updatedFormData)
      const { cid: staticImageCID } = await ipfsService.uploadFile(staticImage)

      // Use MetadataTransformer to handle all transformations
      const nftMetadata = await MetadataTransformer.transformToNFTMetadata(formData, staticImageCID)
      console.log('Transformed NFT Metadata:', nftMetadata)

      // Mint the NFT using the combined metadata
      const metadataCID = await RecipeMetadataService.generateNFTMetadata(nftMetadata, staticImage)
      console.log('Metadata CID generated:', metadataCID)

      const result = await RecipeContractService.mintRecipe(metadataCID)
      console.log('Mint result:', result)

      // Decode the RecipeCreated event
      const recipeCreatedEvent = decodeRecipeEvent(result.logs, RecipeContractService.abi)
      if (!recipeCreatedEvent) {
        throw new Error('RecipeCreated event not found in transaction receipt')
      }

      console.log('Decoded RecipeCreated event:', recipeCreatedEvent)

      if (!result.success) {
        throw new Error('Failed to mint recipe')
      }

      if (onComplete) {
        await onComplete()
      }

      onClose()
    } catch (error) {
      console.error('Minting error:', error)
    } finally {
      setIsMinting(false)
    }
  }

  const header = (
    <>
      <div className='flex flex-col items-center mb-6'>
        <div className='flex items-center gap-3'>
          <IconCertificate className='w-7 h-7 text-github-fg-default' />
          <DialogTitle className='text-xl font-semibold'>CookMore Recipe Badge</DialogTitle>
        </div>
      </div>
      <DialogDescription className='mb-8 text-base text-github-fg-muted text-center px-4'>
        Mint your CookMore badge to claim your recipe
      </DialogDescription>
    </>
  )

  const content = (
    <>
      {showHeader && header}
      <div className='overflow-y-auto px-4' style={{ maxHeight: 'calc(100vh - 12rem)' }}>
        <div id='recipe-card-content' ref={previewRef} data-ready={isPreviewMounted}>
          {/* Remove BadgePreview component */}
        </div>
      </div>

      <div className='flex flex-col items-center gap-4 mt-8 px-4 pb-4'>
        <Button
          onClick={handleMint}
          disabled={!canActuallyMint || isMinting}
          className={cn(
            'flex items-center gap-3 w-full justify-center h-12 text-lg transition-colors duration-200',
            canActuallyMint
              ? 'bg-github-success-emphasis hover:bg-github-success-emphasis/90'
              : 'bg-github-canvas-subtle'
          )}
        >
          {isMinting ? (
            <>
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white' />
              <span className='font-bold'>Minting...</span>
            </>
          ) : (
            <span className='font-bold text-xl'>Mint Recipe</span>
          )}
        </Button>
        <div className='flex items-center gap-2 text-github-fg-muted'>
          <Image src='/icons/brand/base-logo-in-blue.svg' alt='Base' width={20} height={20} />
          <span className='text-sm'>Minted on Base</span>
        </div>
      </div>
    </>
  )

  if (embedded) {
    return content
  }

  return (
    <Suspense fallback={<FallbackSkeleton />}>
      <Dialog open={isOpen} onOpenChange={onClose}>
        {isOpen && <div className='fixed inset-0 z-[150] bg-black/50' aria-hidden='true' />}
        <DialogContent className='fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] overflow-y-auto z-[200] bg-github-canvas-default rounded-lg max-w-md shadow-2xl pr-4'>
          {header}
          {content}
        </DialogContent>
      </Dialog>
    </Suspense>
  )
}
