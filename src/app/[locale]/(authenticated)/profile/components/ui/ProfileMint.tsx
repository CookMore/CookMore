'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/app/api/components/ui/Dialog'
import { Button } from '@/app/api/components/ui/button'
import { ProfileTier, type ProfileFormData } from '@/app/[locale]/(authenticated)/profile/profile'
import { cn } from '@/app/api/utils/utils'
import { IconUser, IconCertificate, IconCurrencyEthereum } from '@/app/api/icons/index'
import { tierInfo } from '@/app/api/tiers/tiers'
import { ipfsService } from '@/app/[locale]/(authenticated)/profile/services/ipfs/ipfs.service'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { decodeProfileEvent } from '@/app/api/blockchain/utils/eventDecoder'
import { profileMetadataService } from '@/app/[locale]/(authenticated)/profile/services/client/metadata.service'
import { contractService } from '@/app/[locale]/(authenticated)/profile/services/client/contract.service'
import { toast } from 'sonner'
import { usePrivy } from '@privy-io/react-auth'
import Image from 'next/image'
import { MetadataTransformer } from '@/app/[locale]/(authenticated)/profile/services/transformers/metadata.transformer'

interface ProfileMintProps {
  isOpen: boolean
  onClose: () => void
  tier: ProfileTier
  formData?: ProfileFormData
  onComplete?: () => Promise<void>
  canMint?: boolean
  embedded?: boolean
  showHeader?: boolean
}

function BadgePreview({
  tier = ProfileTier.FREE,
  formData,
}: {
  tier: ProfileTier
  formData: ProfileFormData
}) {
  const { avatar, name, bio } = formData.basicInfo || {}
  const info = tierInfo[tier] || tierInfo[ProfileTier.FREE]

  const transformedAvatarUrl = avatar
    ? avatar.startsWith('ipfs:')
      ? ipfsService.getHttpUrl(avatar)
      : avatar.startsWith('http:') || avatar.startsWith('https:')
        ? avatar
        : avatar.startsWith('blob:')
          ? avatar
          : ipfsService.getHttpUrl(`ipfs://${avatar}`)
    : ''

  return (
    <div className='w-[300px] mx-auto'>
      <div className='rounded-lg border border-github-border-default shadow-md bg-github-canvas-default'>
        <div className='p-4 border-b border-github-border-default'>
          <h3 className='text-lg font-semibold text-github-fg-default text-center'>
            {name || info.title}
          </h3>
        </div>

        <div className='p-6 space-y-6'>
          <div className='flex justify-center'>
            {transformedAvatarUrl ? (
              <img
                src={transformedAvatarUrl}
                alt='Profile'
                className='w-36 h-36 rounded-full object-cover border-2 border-white shadow-lg'
              />
            ) : (
              <div className='w-36 h-36 rounded-full bg-github-canvas-subtle border-2 border-white shadow-lg flex items-center justify-center'>
                <IconUser className='w-20 h-20 text-github-fg-muted' />
              </div>
            )}
          </div>

          <div className='pt-4 border-t border-github-border-default'>
            <div className='text-sm text-github-fg-muted space-y-3'>
              <div className='flex justify-between items-center'>
                <span>Profile Type:</span>
                <span className='font-medium'>{tierInfo[tier].title}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span>Verification:</span>
                <span className='font-medium'>On-Chain</span>
              </div>
              {bio && (
                <div className='mt-4'>
                  <h4 className='text-sm font-semibold'>Bio:</h4>
                  <p className='text-sm text-github-fg-muted'>{bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProfileMint({
  isOpen,
  onClose,
  tier = ProfileTier.FREE,
  formData = {
    basicInfo: { avatar: '', name: '', bio: '' },
    tier: ProfileTier.FREE,
    version: '1.0',
  },
  onComplete,
  canMint,
  embedded,
  showHeader,
}: ProfileMintProps) {
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

  // Validate required fields
  useEffect(() => {
    const hasRequiredFields = Boolean(formData?.basicInfo?.name && formData?.basicInfo?.bio)
    setCanActuallyMint(Boolean(canMint && hasRequiredFields && isPreviewMounted))
  }, [formData, canMint, isPreviewMounted])

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
        businessOperations: {
          ...formData.businessOperations,
          serviceTypes: (formData.businessOperations?.serviceTypes || []).filter((type) =>
            ['dine-in', 'takeout', 'delivery', 'catering', 'training'].includes(type)
          ),
        },
        culinaryInfo: {
          ...formData.culinaryInfo,
          expertise: ['beginner', 'intermediate', 'advanced', 'professional'].includes(
            formData.culinaryInfo?.expertise
          )
            ? formData.culinaryInfo.expertise
            : 'beginner',
        },
      }

      // Use the updated formData for the generateStaticPreview function
      const staticImage = await profileMetadataService.generateStaticPreview(updatedFormData)
      const { cid: staticImageCID } = await ipfsService.uploadFile(staticImage)

      // Use MetadataTransformer to handle all transformations
      const nftMetadata = await MetadataTransformer.transformToNFTMetadata(
        formData,
        staticImageCID,
        tier
      )
      console.log('Transformed NFT Metadata:', nftMetadata)

      // Mint the NFT using the combined metadata
      const metadataCID = await profileMetadataService.generateNFTMetadata(nftMetadata, staticImage)
      console.log('Metadata CID generated:', metadataCID)

      const result = await contractService.mintProfile(metadataCID)
      console.log('Mint result:', result)

      // Decode the ProfileCreated event
      const profileCreatedEvent = decodeProfileEvent(result.logs, contractService.abi)
      if (!profileCreatedEvent) {
        throw new Error('ProfileCreated event not found in transaction receipt')
      }

      console.log('Decoded ProfileCreated event:', profileCreatedEvent)

      if (!result.success) {
        throw new Error('Failed to mint profile')
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
          <DialogTitle className='text-xl font-semibold'>CookMore Profile Badge</DialogTitle>
        </div>
      </div>
      <DialogDescription className='mb-8 text-base text-github-fg-muted text-center px-4'>
        Mint your CookMore badge to claim your profile
      </DialogDescription>
    </>
  )

  const content = (
    <>
      {showHeader && header}
      <div className='overflow-y-auto px-4' style={{ maxHeight: 'calc(100vh - 12rem)' }}>
        <div id='profile-card-content' ref={previewRef} data-ready={isPreviewMounted}>
          <BadgePreview tier={tier} formData={formData} />
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
            <span className='font-bold text-xl'>Mint Profile</span>
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      {isOpen && <div className='fixed inset-0 z-[150] bg-black/50' aria-hidden='true' />}
      <DialogContent className='fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] overflow-y-auto z-[200] bg-github-canvas-default rounded-lg max-w-md shadow-2xl pr-4'>
        {header}
        {content}
      </DialogContent>
    </Dialog>
  )
}
