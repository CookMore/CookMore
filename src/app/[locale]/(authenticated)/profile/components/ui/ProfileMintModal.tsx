'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/button'
import { useProfileRegistry } from '@/lib/web3/hooks/useProfileRegistry'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import type { GroupProfileMetadata } from '@/app/[locale]/(authenticated)/profile/profile'
import { cn } from '@/lib/utils/utils'
import { toast } from 'sonner'

type Step = 'preview' | 'minting' | 'complete'

interface ProfileFormData extends GroupProfileMetadata {
  tier: ProfileTier
}

interface ProfileMintModalProps {
  isOpen: boolean
  onClose: () => void
  formData: ProfileFormData
}

export function ProfileMintModal({ isOpen, onClose, formData }: ProfileMintModalProps) {
  const [step, setStep] = useState<Step>('preview')
  const { createProfile } = useProfileRegistry()

  const handleMint = async () => {
    try {
      // Validate required fields
      const requiredFields = ['name', 'description', 'tier']
      const missingFields = requiredFields.filter((field) => !formData[field])

      if (missingFields.length > 0) {
        toast.error('Missing Required Fields', {
          description: `Please fill in the following fields: ${missingFields.join(', ')}`,
        })
        return
      }

      setStep('minting')

      await createProfile(formData, formData.tier)
      setStep('complete')

      toast.success('Profile Minted!', {
        description: 'Your profile has been created successfully.',
      })

      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error: any) {
      console.error('Minting error:', error)
      toast.error('Minting Error', {
        description: error?.message || 'Failed to mint profile',
      })
      setStep('preview')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>
          {step === 'preview' && 'Preview Your Profile'}
          {step === 'minting' && 'Minting Your Profile...'}
          {step === 'complete' && 'Profile Created!'}
        </DialogTitle>

        <div className='mt-4'>
          {step === 'preview' && (
            <div className='space-y-4'>
              <div className='rounded-lg border p-4'>
                <h3 className='font-medium'>{formData.name}</h3>
                <p className='text-sm text-gray-500'>{formData.description}</p>
              </div>

              <Button
                onClick={handleMint}
                className={cn('w-full', step === 'minting' && 'cursor-not-allowed opacity-50')}
                disabled={step === 'minting'}
              >
                Mint Profile
              </Button>
            </div>
          )}

          {step === 'minting' && (
            <div className='flex flex-col items-center justify-center space-y-4'>
              <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-github-accent-emphasis' />
              <p>Please wait while we mint your profile...</p>
            </div>
          )}

          {step === 'complete' && (
            <div className='flex flex-col items-center justify-center space-y-4'>
              <div className='rounded-full bg-github-success-emphasis p-2'>
                <svg
                  className='h-6 w-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <p>Your profile has been created successfully!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
