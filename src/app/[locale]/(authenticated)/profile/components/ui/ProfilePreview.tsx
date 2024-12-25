'use client'

import { Dialog, DialogContent, DialogTitle } from '@/app/api/components/ui/Dialog'
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
} from '@/app/api/icons/index'
import { tierStyles } from '@/app/api/tiers/tiers'

interface ProfilePreviewProps {
  isOpen: boolean
  onClose: () => void
  tier: ProfileTier
  formData?: Partial<GroupProfileMetadata>
  onComplete?: () => Promise<void>
  isLastStep?: boolean
  embedded?: boolean
}

function PreviewContent({
  tier,
  formData,
}: {
  tier: ProfileTier
  formData: Partial<GroupProfileMetadata>
}) {
  const style = tierStyles[tier]

  return (
    <div className='space-y-8'>
      {/* NFT Preview */}
      <div className={cn('rounded-lg p-6 border-2', style.borderColor, style.bgColor)}>
        <div className='flex items-center gap-3 mb-4'>
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', style.iconBg)}>
            <style.icon className={cn('h-5 w-5', style.color)} />
          </div>
          <h3 className={cn('text-lg font-semibold', style.color)}>NFT Preview</h3>
        </div>

        <div className='aspect-square w-full rounded-lg overflow-hidden border border-github-border-default'>
          <div className='relative w-full h-full bg-github-canvas-subtle'>
            {/* Profile Image */}
            <div className='absolute inset-0 flex items-center justify-center'>
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt='Profile'
                  className='w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl'
                />
              ) : (
                <div className='w-48 h-48 rounded-full bg-github-canvas-default border-4 border-white shadow-xl flex items-center justify-center'>
                  <IconUser className='w-24 h-24 text-github-fg-muted' />
                </div>
              )}
            </div>

            {/* Tier Badge */}
            <div
              className={cn(
                'absolute top-4 right-4 px-3 py-1 rounded-full',
                style.badgeColor,
                'text-white text-sm font-medium'
              )}
            >
              {tier}
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

        <ProfileCard profile={formData} />
      </div>
    </div>
  )
}

export function ProfilePreview({
  isOpen,
  onClose,
  tier,
  formData = {},
  onComplete,
  isLastStep,
  embedded,
}: ProfilePreviewProps) {
  if (embedded) {
    return <PreviewContent tier={tier} formData={formData} />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'max-w-2xl max-h-[90vh] flex flex-col',
          'fixed left-[50%] top-[50%] z-[9999]',
          '-translate-x-1/2 -translate-y-1/2',
          'border border-github-border-default rounded-lg',
          'bg-github-canvas-default shadow-lg'
        )}
      >
        <DialogTitle className='text-xl font-bold p-4 border-b border-github-border-default text-center'>
          Preview Profile
        </DialogTitle>
        <div className='flex-1 overflow-y-auto p-6'>
          <PreviewContent tier={tier} formData={formData} />
        </div>
        <div className='flex justify-end gap-2 p-4 border-t border-github-border-default bg-github-canvas-subtle'>
          <Button onClick={onClose} variant='secondary'>
            Close
          </Button>
          {isLastStep && onComplete && (
            <Button onClick={onComplete} variant='default'>
              Complete Profile
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
