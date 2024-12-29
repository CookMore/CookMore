'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/app/api/components/ui/Dialog'
import { Button } from '@/app/api/components/ui/button'
import { ProfileTier, type ProfileFormData } from '@/app/[locale]/(authenticated)/profile/profile'
import { IconUser, IconGlobe } from '@/app/api/icons/index'
import { ProfileMint } from './ProfileMint'
import { type Abi } from 'viem'
import { profileMetadataService } from '../../services/client/metadata.service'

interface ProfilePreviewProps {
  isOpen: boolean
  onClose: () => void
  tier: ProfileTier
  formData?: ProfileFormData
  onComplete?: () => Promise<void>
  onMint?: () => Promise<{ eventLog: { topics: string[]; data: string }; abi: Abi }>
  canMint?: boolean
}

function PreviewSection({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: any
  children: React.ReactNode
}) {
  return (
    <div className='border-b border-github-border-default last:border-b-0 py-3'>
      <div className='flex items-center gap-2 mb-2'>
        <Icon className='w-4 h-4 text-github-fg-default' />
        <h3 className='text-sm font-medium text-github-fg-default'>{title}</h3>
      </div>
      <div className='pl-6'>{children}</div>
    </div>
  )
}

function ProfileSections({ formData }: { formData: ProfileFormData }) {
  const { basicInfo, socialLinks } = formData

  return (
    <div className='space-y-1 text-sm'>
      <PreviewSection title='Basic Info' icon={IconUser}>
        <div className='space-y-1 text-github-fg-muted'>
          <p>
            <span className='font-medium'>Name:</span> {basicInfo?.name}
          </p>
          <p>
            <span className='font-medium'>Bio:</span> {basicInfo?.bio}
          </p>
          {basicInfo?.location && (
            <p>
              <span className='font-medium'>Location:</span> {basicInfo.location}
            </p>
          )}
        </div>
      </PreviewSection>

      {socialLinks && Object.keys(socialLinks).length > 0 && (
        <PreviewSection title='Social Links' icon={IconGlobe}>
          <div className='space-y-1 text-github-fg-muted'>
            {socialLinks.twitter && (
              <p>
                <span className='font-medium'>Twitter:</span> {socialLinks.twitter}
              </p>
            )}
            {socialLinks.website && (
              <p>
                <span className='font-medium'>Website:</span> {socialLinks.website}
              </p>
            )}
          </div>
        </PreviewSection>
      )}
    </div>
  )
}

export function ProfilePreview({
  isOpen,
  onClose,
  tier = ProfileTier.FREE,
  formData = {
    basicInfo: { avatar: '', name: '', bio: '' },
    tier: ProfileTier.FREE,
    version: '1.0',
  },
  onComplete,
  onMint,
  canMint = true,
}: ProfilePreviewProps) {
  const [isPreviewMounted, setIsPreviewMounted] = useState(false)
  const previewMountedRef = useRef(false)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [canActuallyMint, setCanActuallyMint] = useState(false)

  // Handle preview mount
  useEffect(() => {
    if (isOpen && !previewMountedRef.current) {
      const timeoutId = setTimeout(() => {
        previewMountedRef.current = true
        setIsPreviewMounted(true)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [isOpen])

  // Reset mount state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      previewMountedRef.current = false
      setIsPreviewMounted(false)
      setCanActuallyMint(false)
    }
  }, [isOpen])

  // Validate required fields
  useEffect(() => {
    const hasRequiredFields = Boolean(formData?.basicInfo?.name && formData?.basicInfo?.bio)
    setCanActuallyMint(Boolean(hasRequiredFields && isPreviewMounted && !isGeneratingPreview))
  }, [formData, isPreviewMounted, isGeneratingPreview])

  const handleMint = async () => {
    if (!onMint || !canActuallyMint) return
    setIsGeneratingPreview(true)
    try {
      const result = await onMint()
      if (onComplete) {
        await onComplete()
      }
      return result
    } catch (error) {
      console.error('Error during minting:', error)
      throw error // Re-throw to ensure proper error handling
    } finally {
      setIsGeneratingPreview(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {isOpen && <div className='fixed inset-0 z-[150] bg-black/50' aria-hidden='true' />}
      <DialogContent className='fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] overflow-y-auto z-[200] bg-github-canvas-default rounded-lg max-w-6xl shadow-2xl'>
        <div className='flex items-stretch justify-center p-8'>
          {/* Left side: Profile Info */}
          <div className='w-[400px] shrink-0'>
            <h2 className='text-lg font-semibold mb-4'>Profile Information</h2>
            <div className='rounded-lg border border-github-border-default bg-github-canvas-default p-4'>
              <ProfileSections formData={formData} />
            </div>
          </div>

          {/* Vertical Divider */}
          <div className='w-px bg-github-border-default mx-8' />

          {/* Right side: Mint UI */}
          <div className='w-[400px] shrink-0'>
            <div id='profile-card-content' data-ready={isPreviewMounted}>
              <ProfileMint
                isOpen={true}
                onClose={() => {}}
                tier={tier}
                formData={formData}
                onComplete={onComplete}
                onMint={handleMint}
                canMint={true}
                embedded={true}
                showHeader={true}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
