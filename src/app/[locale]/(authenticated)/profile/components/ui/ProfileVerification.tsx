'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ProfileVerificationProps {
  isVerified: boolean
  onVerify: () => Promise<void>
}

export function ProfileVerification({ isVerified, onVerify }: ProfileVerificationProps) {
  const handleVerify = async () => {
    try {
      await onVerify()
      toast.success('Profile verified successfully!')
    } catch (error) {
      toast.error('Failed to verify profile')
      console.error('Verification error:', error)
    }
  }

  return (
    <div className='p-4 border border-github-border-default rounded-lg'>
      <h3 className='text-lg font-medium mb-2'>Profile Verification</h3>
      {isVerified ? (
        <div className='flex items-center space-x-2 text-github-success-fg'>
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
          <span>Profile Verified</span>
        </div>
      ) : (
        <div className='space-y-2'>
          <p className='text-sm text-github-fg-muted'>
            Verify your profile to unlock additional features and build trust with the community.
          </p>
          <Button onClick={handleVerify} className='w-full'>
            Verify Profile
          </Button>
        </div>
      )}
    </div>
  )
}
