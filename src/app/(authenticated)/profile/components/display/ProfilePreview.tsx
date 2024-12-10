'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/button'
import { ProfileCard } from './ProfileCard'
import { ProfileTier } from '@/types/profile'
import type { GroupProfileMetadata } from '@/types/profile'
import { cn } from '@/lib/utils/utils'
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
} from '@/components/ui/icons'

interface ProfilePreviewProps {
  isOpen: boolean
  onClose: () => void
  tier: ProfileTier
  formData?: Partial<GroupProfileMetadata>
  onComplete?: () => Promise<void>
  isLastStep?: boolean
  embedded?: boolean
}

// Helper function to check if a section is complete
const isSectionComplete = (section: any) => {
  if (!section) return false
  return Object.values(section).some(
    (value) => value !== undefined && value !== '' && value !== null
  )
}

function PreviewContent(
  {
    /* props */
  }
) {
  // ... PreviewContent implementation
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
  // Required metadata fields with defaults
  const requiredMetadata = {
    name: formData?.name || '',
    bio: formData?.bio || '',
    avatar: formData?.avatar || '',
  }

  if (embedded) {
    return <PreviewContent />
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
        <div className='flex-1 overflow-hidden p-4'>
          <PreviewContent />
        </div>
        {!embedded && (
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
        )}
      </DialogContent>
    </Dialog>
  )
}
