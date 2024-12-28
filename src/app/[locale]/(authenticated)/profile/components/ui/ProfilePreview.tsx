'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/app/api/components/ui/Dialog'
import { Button } from '@/app/api/components/ui/button'
import { ProfileCard } from '../ui/ProfileCard'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import type { GroupProfileMetadata } from '@/app/[locale]/(authenticated)/profile/profile'
import { cn } from '@/app/api/utils/utils'
import {
  IconUser,
  IconBook,
  IconChefHat,
  IconGlobe,
  IconBriefcase,
  IconCertificate,
  IconCalendar,
  IconStore,
  IconBuilding,
  IconGear,
  IconUsers,
  IconTruck,
  IconShield,
  IconCheck,
  IconAlertCircle,
  IconEye,
  IconCurrencyEthereum,
} from '@/app/api/icons/index'
import { tierStyles } from '@/app/api/tiers/tiers'
import type { GenerationProgress } from '../../services/client/metadata.service'
import { ipfsService } from '@/app/[locale]/(authenticated)/profile/services/ipfs/ipfs.service'
import type { ProfileFormData } from '../../profile'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { decodeProfileEvent } from '@/app/api/blockchain/utils/eventDecoder'
import { Interactive3DTier } from '@/app/api/components/ui/Interactive3DTier'

interface ProfilePreviewProps {
  isOpen: boolean
  onClose: () => void
  tier: ProfileTier
  formData?: ProfileFormData
  onComplete?: () => Promise<void>
  isLastStep?: boolean
  embedded?: boolean
  generationProgress?: GenerationProgress
  onMint?: () => Promise<{ eventLog: { topics: string[]; data: string }; abi: Abi }>
  canMint?: boolean
  onGeneratePreview?: () => Promise<void>
  onReady?: () => void
}

function GenerationProgressIndicator({ progress }: { progress: GenerationProgress }) {
  const getProgressColor = () => {
    switch (progress.stage) {
      case 'preparing':
        return 'text-github-fg-muted'
      case 'loading-images':
        return 'text-github-accent-fg'
      case 'capturing':
        return 'text-github-success-fg'
      case 'processing':
        return 'text-github-done-fg'
      case 'complete':
        return 'text-github-done-fg'
      default:
        return 'text-github-fg-muted'
    }
  }

  return (
    <div className='absolute inset-0 flex flex-col items-center justify-center bg-github-canvas-default bg-opacity-90 z-10'>
      <div className='w-64 text-center'>
        <div className='animate-pulse mb-4'>
          <div className={cn('text-lg font-medium mb-2', getProgressColor())}>
            {progress.message}
          </div>
          <div className='w-full bg-github-canvas-subtle rounded-full h-2'>
            <div
              className={cn('h-full rounded-full transition-all duration-300', getProgressColor())}
              style={{ width: `${progress.progress}%` }}
            />
          </div>
        </div>
        <div className='text-sm text-github-fg-muted'>{progress.progress.toFixed(0)}% Complete</div>
      </div>
    </div>
  )
}

function PreviewContent({
  tier = ProfileTier.FREE,
  formData,
  generationProgress,
  onReady,
}: {
  tier: ProfileTier
  formData: ProfileFormData
  generationProgress?: GenerationProgress
  onReady?: () => void
}) {
  const [isContentReady, setIsContentReady] = useState(false)
  const [hasSignaledReady, setHasSignaledReady] = useState(false)
  const [showInteractive, setShowInteractive] = useState(false)

  // Signal ready only once when content is ready
  useEffect(() => {
    if (isContentReady && !hasSignaledReady) {
      console.log('PreviewContent - Signaling ready state')
      setHasSignaledReady(true)
      onReady?.()
    }
  }, [isContentReady, hasSignaledReady, onReady])

  // Set content ready after mount
  useEffect(() => {
    console.log('PreviewContent - Initial mount with data:', {
      formData,
      tier,
    })
    const timeoutId = setTimeout(() => {
      console.log('PreviewContent - Setting content ready')
      setIsContentReady(true)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [formData, tier])

  const style = tierStyles[tier] || tierStyles[ProfileTier.FREE]
  const info = tierInfo[tier]

  const safeFormData = {
    avatar: formData?.basicInfo?.avatar || '',
    name: formData?.basicInfo?.name || 'Unnamed Profile',
    bio: formData?.basicInfo?.bio || '',
  }

  const getImageUrl = (url?: string | null) => {
    if (!url) return ''
    try {
      if (url.startsWith('blob:')) return url
      if (url.startsWith('ipfs:')) return ipfsService.getHttpUrl(url)
      if (url.startsWith('http:') || url.startsWith('https:')) return url
      return ipfsService.getHttpUrl(`ipfs://${url}`)
    } catch (error) {
      console.error('Error processing image URL:', error)
      return ''
    }
  }

  return (
    <div id='profile-preview' className='space-y-8' data-ready={isContentReady}>
      {/* NFT Preview */}
      <div className={cn('rounded-lg p-6 border-2', style.borderColor, style.bgColor)}>
        {generationProgress && <GenerationProgressIndicator progress={generationProgress} />}
        <div className='flex items-center gap-3 mb-4'>
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', style.iconBg)}>
            <style.icon className={cn('h-5 w-5', style.color)} />
          </div>
          <h3 className={cn('text-lg font-semibold', style.color)}>
            {safeFormData.name || info.title}
          </h3>
        </div>

        <div className='aspect-square w-full rounded-lg overflow-hidden border border-github-border-default'>
          <div className='relative w-full h-full bg-github-canvas-subtle'>
            {/* Profile Image */}
            <div className='absolute inset-0 flex items-center justify-center'>
              {safeFormData.avatar ? (
                <img
                  src={getImageUrl(safeFormData.avatar)}
                  alt='Profile'
                  className='w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl'
                />
              ) : (
                <div className='w-48 h-48 rounded-full bg-github-canvas-default border-4 border-white shadow-xl flex items-center justify-center'>
                  <IconUser className='w-24 h-24 text-github-fg-muted' />
                </div>
              )}
            </div>

            {/* Interactive Tier Badge */}
            <div className='absolute top-4 right-4'>
              <button
                onClick={() => setShowInteractive(!showInteractive)}
                className='transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis rounded-lg'
              >
                {showInteractive ? (
                  <Interactive3DTier tier={tier} className='w-32 h-32' />
                ) : (
                  <div
                    className={cn(
                      'px-3 py-1 rounded-full',
                      style.badgeColor,
                      'text-white text-sm font-medium'
                    )}
                  >
                    {info.title}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Preview */}
      <div className='rounded-lg border border-github-border-default bg-github-canvas-default p-6'>
        <div className='flex items-center gap-3 mb-6'>
          <IconEye className='w-5 h-5 text-github-fg-muted' />
          <h3 className='text-lg font-semibold text-github-fg-default'>Profile Preview</h3>
        </div>
        <ProfileCard profile={safeFormData} />
      </div>
    </div>
  )
}

export function ProfilePreview({
  isOpen,
  onClose,
  tier = ProfileTier.FREE,
  formData = { basicInfo: { avatar: '', name: '', bio: '' }, tier: ProfileTier.FREE, version: 1 },
  onComplete,
  isLastStep,
  embedded,
  generationProgress,
  onMint,
  canMint,
  onGeneratePreview,
  onReady,
}: ProfilePreviewProps) {
  const [isMinting, setIsMinting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGeneratedPreview, setHasGeneratedPreview] = useState(false)

  const { user, isAuthenticated } = useAuth()

  // Update generation state based on progress
  useEffect(() => {
    if (generationProgress?.stage === 'complete') {
      setIsGenerating(false)
      setHasGeneratedPreview(true)
    }
  }, [generationProgress])

  const handleMint = async () => {
    if (!onMint || !isAuthenticated) return

    // If preview hasn't been generated yet, generate it first
    if (!hasGeneratedPreview) {
      setIsGenerating(true)
      try {
        if (onGeneratePreview) {
          await onGeneratePreview()
          setIsGenerating(false)
          setHasGeneratedPreview(true)
          return
        }
      } catch (error) {
        console.error('Failed to generate preview:', error)
        setIsGenerating(false)
        return
      }
    }

    // Only proceed with minting if explicitly clicked after preview is generated
    if (hasGeneratedPreview) {
      setIsMinting(true)
      try {
        const mintResult = await onMint()

        // Decode the mint event
        const decodedEvent = decodeProfileEvent(mintResult.eventLog, mintResult.abi)
        console.log('Decoded Mint Event:', decodedEvent)

        if (!decodedEvent) {
          throw new Error('Failed to decode mint event')
        }

        // Verify the event is for the correct wallet
        if (decodedEvent.args.wallet?.toLowerCase() !== user?.wallet?.address?.toLowerCase()) {
          throw new Error('Minted profile wallet address mismatch')
        }

        // Extract profile data from event
        const profileData = {
          profileId: decodedEvent.args.profileId?.toString(),
          metadataURI: decodedEvent.args.metadataURI,
          wallet: decodedEvent.args.wallet,
        }

        console.log('Minted Profile Data:', profileData)

        // Call onComplete with the profile data
        if (onComplete) {
          await onComplete()
        }

        // Close the dialog after successful mint
        onClose()
      } catch (error) {
        console.error('Minting error:', error)
        // You might want to show an error toast here
      } finally {
        setIsMinting(false)
      }
    }
  }

  // Render content directly without Suspense
  const content = (
    <PreviewContent
      tier={tier}
      formData={formData}
      generationProgress={generationProgress}
      onReady={onReady}
    />
  )

  if (embedded) {
    return content
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {isOpen && <div className='fixed inset-0 z-[150] bg-black/50' aria-hidden='true' />}
      <DialogContent
        className='fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-3xl max-h-[90vh] overflow-y-auto z-[200] bg-github-canvas-default rounded-lg'
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        <DialogTitle>Profile Preview</DialogTitle>
        <DialogDescription className='sr-only'>
          Preview of your profile before minting
        </DialogDescription>
        <div className='overflow-y-auto pr-2' style={{ maxHeight: 'calc(100vh - 10rem)' }}>
          {content}
        </div>
        <div className='flex justify-end gap-3 mt-6'>
          <Button variant='outline' onClick={onClose} disabled={isMinting || isGenerating}>
            {isMinting || isGenerating ? 'Please wait...' : 'Close'}
          </Button>
          {onMint && (
            <Button
              onClick={handleMint}
              disabled={!canMint || isMinting || isGenerating}
              className={cn(
                'flex items-center gap-2',
                canMint
                  ? 'bg-github-success-emphasis hover:bg-github-success-emphasis/90'
                  : 'bg-github-canvas-subtle'
              )}
            >
              {isMinting ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
                  <span>Minting...</span>
                </>
              ) : isGenerating ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-github-fg-muted' />
                  <span>Generating Preview...</span>
                </>
              ) : !hasGeneratedPreview ? (
                <>
                  <IconEye className='w-4 h-4' />
                  <span>Generate Preview</span>
                </>
              ) : (
                <>
                  <IconCurrencyEthereum className='w-4 h-4' />
                  <span>Mint Profile</span>
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
