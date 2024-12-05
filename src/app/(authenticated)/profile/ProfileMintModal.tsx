'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/button'
import ProfilePreview from './ProfilePreview'
import { useProfileRegistry } from '@/hooks/useProfileRegistry'
import { ProfileTier } from '@/types/profile'
import type { GroupProfileMetadata } from '@/types/profile'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { IconCheck } from '@/components/ui/icons'
import { cn } from '@/lib/utils/utils'
import { useToast } from '@/components/ui/use-toast'
import { PageContainer } from '@/components/PageContainer'

type Step = 'preview' | 'minting' | 'complete'

// Required fields for on-chain metadata
const validateOnChainFields = (data: GroupProfileMetadata) => {
  const requiredFields = {
    name: 'Name',
    bio: 'Bio',
    avatar: 'Avatar',
    baseName: 'Organization Name',
    organizationInfo: {
      type: 'Organization Type',
      establishedYear: 'Established Year',
      size: 'Organization Size',
    },
  }

  const errors: string[] = []

  // Check top-level fields
  Object.entries(requiredFields).forEach(([key, label]) => {
    if (typeof label === 'string' && !data[key as keyof GroupProfileMetadata]) {
      errors.push(label)
    }
  })

  // Check nested organizationInfo fields
  if (data.organizationInfo) {
    Object.entries(requiredFields.organizationInfo).forEach(([key, label]) => {
      if (!data.organizationInfo[key as keyof typeof data.organizationInfo]) {
        errors.push(label)
      }
    })
  } else {
    errors.push('Organization Information')
  }

  return errors
}

interface ProfileMintModalProps {
  isOpen: boolean
  onClose: () => void
  formData: ProfileFormData
}

export function ProfileMintModal({ isOpen, onClose, formData }: ProfileMintModalProps) {
  const [step, setStep] = useState<Step>('preview')
  const [isHydrated, setIsHydrated] = useState(false)
  const { createProfile } = useProfileRegistry()
  const { toast } = useToast()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const handleMint = async () => {
    if (!isHydrated) return

    try {
      // Validate required fields
      const missingFields = validateOnChainFields(formData)
      if (missingFields.length > 0) {
        toast({
          title: 'Missing Required Fields',
          description: `Please fill in the following fields: ${missingFields.join(', ')}`,
          variant: 'destructive',
        })
        return
      }

      setStep('minting')
      // Add tier to metadata
      const metadataWithTier = {
        ...formData,
        tier: ProfileTier.GROUP,
      }
      await createProfile(metadataWithTier, ProfileTier.GROUP)
      setStep('complete')
    } catch (error: any) {
      console.error('Minting error:', error)
      toast({
        title: 'Minting Error',
        description: error?.message || 'Failed to mint profile',
        variant: 'destructive',
      })
      setStep('preview') // Reset on error
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'max-w-4xl max-h-[90vh] flex flex-col',
          'fixed left-[50%] top-[50%] z-[999999]',
          '-translate-x-1/2 -translate-y-1/2',
          'border border-github-border-default rounded-lg',
          'bg-github-canvas-default shadow-lg',
          'p-6'
        )}
      >
        <DialogTitle className='text-2xl font-bold mb-4'>Profile Creation</DialogTitle>
        <div className='flex-1 overflow-y-auto'>
          <PageContainer>
            {step === 'preview' && (
              <div className='space-y-6'>
                <ProfilePreview
                  isOpen={true}
                  onClose={() => {}}
                  tier={ProfileTier.GROUP}
                  formData={formData}
                  embedded={true}
                />
                <div className='flex justify-end gap-2 pt-4 border-t border-github-border-default'>
                  <Button onClick={onClose} variant='secondary'>
                    Cancel
                  </Button>
                  <Button onClick={handleMint} disabled={!isHydrated} variant='default'>
                    Mint Profile
                  </Button>
                </div>
              </div>
            )}
            {step === 'minting' && (
              <div className='flex flex-col items-center justify-center py-8 space-y-4'>
                <LoadingSpinner className='w-8 h-8' />
                <p className='text-github-fg-default'>Minting your profile...</p>
              </div>
            )}
            {step === 'complete' && (
              <div className='flex flex-col items-center justify-center py-8 space-y-4'>
                <div className='rounded-full bg-github-success-subtle p-3'>
                  <IconCheck className='w-6 h-6 text-github-success-fg' />
                </div>
                <h2 className='text-2xl font-bold text-github-fg-default'>Profile Minted!</h2>
                <p className='text-github-fg-muted'>Your profile has been successfully created.</p>
                <Button onClick={onClose} variant='default'>
                  Close
                </Button>
              </div>
            )}
          </PageContainer>
        </div>
      </DialogContent>
    </Dialog>
  )
}
