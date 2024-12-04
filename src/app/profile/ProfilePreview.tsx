'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/button'
import { ProfileCard } from './ProfileCard'
import { ProfileTier } from '@/types/profile'
import type { GroupProfileMetadata } from '@/types/profile'
import { cn } from '@/lib/utils/utils'
import { PageContainer } from '@/components/PageContainer'
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

export default function ProfilePreview({
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

  const PreviewContent = () => (
    <div className='space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-github-border-default scrollbar-track-github-canvas-subtle'>
      {/* Profile Card with Banner & Avatar */}
      <div className='bg-github-canvas-subtle rounded-lg overflow-hidden border border-github-border-default shadow-sm hover:shadow-md transition-shadow duration-200'>
        <div className='relative h-24 bg-gradient-to-r from-github-accent-subtle to-github-accent-muted'>
          {formData.banner ? (
            <img
              src={formData.banner}
              alt='Profile Banner'
              className='w-full h-full object-cover'
            />
          ) : null}
        </div>
        <div className='relative px-4 pb-4'>
          <div className='absolute -top-10 left-4 w-20 h-20 rounded-full border-4 border-github-canvas-default bg-github-canvas-subtle overflow-hidden'>
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt='Profile Avatar'
                className='w-full h-full object-cover'
              />
            ) : (
              <IconUser className='w-full h-full p-4 text-github-fg-muted' />
            )}
          </div>
          <div className='pt-12 space-y-1'>
            <h2 className='text-lg font-semibold text-github-fg-default'>
              {formData.name || 'Your Name'}
            </h2>
            <p className='text-sm text-github-fg-muted'>
              {formData.bio || 'Your bio will appear here'}
            </p>
          </div>
        </div>
      </div>

      {/* Free Tier Section */}
      <div className='rounded-lg border border-github-border-default overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200'>
        <div className='bg-github-canvas-subtle px-3 py-1.5 border-b border-github-border-default'>
          <h2 className='text-xs font-semibold text-github-fg-muted'>Free Tier Features</h2>
        </div>
        <div className='p-3 space-y-4 bg-github-canvas-default'>
          {/* Basic Info Section */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1.5'>
                <IconUser className='w-3.5 h-3.5 text-github-fg-muted' />
                <h3 className='text-xs font-semibold text-github-fg-default'>Basic Information</h3>
              </div>
              {isSectionComplete(requiredMetadata) ? (
                <IconCheck className='w-3.5 h-3.5 text-github-success-fg' />
              ) : (
                <IconAlertCircle className='w-3.5 h-3.5 text-github-attention-fg' />
              )}
            </div>
            <div className='grid grid-cols-2 gap-2 pl-5'>
              <div>
                <p className='text-[11px] font-medium text-github-fg-muted'>Name</p>
                <p className='text-xs text-github-fg-default'>{formData.name || 'Not set'}</p>
              </div>
              <div>
                <p className='text-[11px] font-medium text-github-fg-muted'>Bio</p>
                <p className='text-xs text-github-fg-default'>{formData.bio || 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Culinary Info Section */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1.5'>
                <IconChefHat className='w-3.5 h-3.5 text-github-fg-muted' />
                <h3 className='text-xs font-semibold text-github-fg-default'>Culinary Profile</h3>
              </div>
              {isSectionComplete(formData?.culinaryInfo) ? (
                <IconCheck className='w-3.5 h-3.5 text-github-success-fg' />
              ) : (
                <IconAlertCircle className='w-3.5 h-3.5 text-github-attention-fg' />
              )}
            </div>
            <div className='grid grid-cols-2 gap-2 pl-5'>
              <div>
                <p className='text-[11px] font-medium text-github-fg-muted'>Expertise</p>
                <p className='text-xs text-github-fg-default capitalize'>
                  {formData.culinaryInfo?.expertise || 'Not set'}
                </p>
              </div>
              {formData.culinaryInfo?.specialties?.length > 0 && (
                <div>
                  <p className='text-[11px] font-medium text-github-fg-muted'>Specialties</p>
                  <div className='flex flex-wrap gap-1 mt-0.5'>
                    {formData.culinaryInfo.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className='px-1 py-0.5 text-[10px] rounded-full bg-github-accent-muted text-github-accent-fg'
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pro Tier Section */}
      {tier === ProfileTier.PRO && (
        <div className='rounded-lg border border-github-accent-muted overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200'>
          <div className='bg-github-accent-subtle px-3 py-1.5 border-b border-github-accent-muted'>
            <h2 className='text-xs font-semibold text-github-accent-fg'>Pro Features</h2>
          </div>
          <div className='p-3 space-y-4 bg-github-canvas-default'>
            {/* Experience Section */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1.5'>
                  <IconBriefcase className='w-3.5 h-3.5 text-github-fg-muted' />
                  <h3 className='text-xs font-semibold text-github-fg-default'>Experience</h3>
                </div>
                {isSectionComplete(formData?.experience) ? (
                  <IconCheck className='w-3.5 h-3.5 text-github-success-fg' />
                ) : (
                  <IconAlertCircle className='w-3.5 h-3.5 text-github-attention-fg' />
                )}
              </div>
              <div className='pl-5'>
                {formData.experience?.current && (
                  <div className='mb-2'>
                    <p className='text-[11px] font-medium text-github-fg-muted'>Current Position</p>
                    <div className='mt-1 p-2 rounded-md border border-github-border-default bg-github-canvas-subtle'>
                      <p className='text-xs font-medium text-github-fg-default'>
                        {formData.experience.current.title}
                      </p>
                      <p className='text-[11px] text-github-fg-muted'>
                        {formData.experience.current.company}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Certifications Section */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1.5'>
                  <IconCertificate className='w-3.5 h-3.5 text-github-fg-muted' />
                  <h3 className='text-xs font-semibold text-github-fg-default'>Certifications</h3>
                </div>
                {formData.certifications?.length > 0 ? (
                  <IconCheck className='w-3.5 h-3.5 text-github-success-fg' />
                ) : (
                  <IconAlertCircle className='w-3.5 h-3.5 text-github-attention-fg' />
                )}
              </div>
              <div className='pl-5'>
                {formData.certifications?.map((cert, index) => (
                  <div
                    key={index}
                    className='mb-2 p-2 rounded-md border border-github-border-default bg-github-canvas-subtle'
                  >
                    <p className='text-xs font-medium text-github-fg-default'>{cert.name}</p>
                    <p className='text-[11px] text-github-fg-muted'>{cert.issuer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Group Tier Section */}
      {tier === ProfileTier.GROUP && (
        <div className='rounded-lg border border-github-success-muted overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200'>
          <div className='bg-github-success-subtle px-3 py-1.5 border-b border-github-success-muted'>
            <h2 className='text-xs font-semibold text-github-success-fg'>Group Features</h2>
          </div>
          <div className='p-3 space-y-4 bg-github-canvas-default'>
            {/* Organization Info */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1.5'>
                  <IconBuilding className='w-3.5 h-3.5 text-github-fg-muted' />
                  <h3 className='text-xs font-semibold text-github-fg-default'>
                    Organization Details
                  </h3>
                </div>
                {isSectionComplete(formData?.organizationInfo) ? (
                  <IconCheck className='w-3.5 h-3.5 text-github-success-fg' />
                ) : (
                  <IconAlertCircle className='w-3.5 h-3.5 text-github-attention-fg' />
                )}
              </div>
              <div className='grid grid-cols-2 gap-2 pl-5'>
                <div>
                  <p className='text-[11px] font-medium text-github-fg-muted'>Type</p>
                  <p className='text-xs text-github-fg-default'>
                    {formData.organizationInfo?.type || 'Not set'}
                  </p>
                </div>
                <div>
                  <p className='text-[11px] font-medium text-github-fg-muted'>Size</p>
                  <p className='text-xs text-github-fg-default'>
                    {formData.organizationInfo?.size || 'Not set'}
                  </p>
                </div>
                <div>
                  <p className='text-[11px] font-medium text-github-fg-muted'>Established</p>
                  <p className='text-xs text-github-fg-default'>
                    {formData.organizationInfo?.establishedYear || 'Not set'}
                  </p>
                </div>
              </div>
            </div>

            {/* Team Section */}
            {formData?.organizationInfo?.team?.length > 0 && (
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-1.5'>
                    <IconUsers className='w-3.5 h-3.5 text-github-fg-muted' />
                    <h3 className='text-xs font-semibold text-github-fg-default'>Team</h3>
                  </div>
                  {formData.organizationInfo.team.length > 0 ? (
                    <IconCheck className='w-3.5 h-3.5 text-github-success-fg' />
                  ) : (
                    <IconAlertCircle className='w-3.5 h-3.5 text-github-attention-fg' />
                  )}
                </div>
                <div className='pl-5'>
                  {formData.organizationInfo.team.map((member, index) => (
                    <div
                      key={index}
                      className='mb-2 p-2 rounded-md border border-github-border-default bg-github-canvas-subtle'
                    >
                      <p className='text-xs font-medium text-github-fg-default'>{member.role}</p>
                      <p className='text-[11px] text-github-fg-muted'>
                        {member.count} {member.count === 1 ? 'position' : 'positions'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mint Button */}
      <div className='pt-2'>
        <button
          className='w-full px-4 py-2 rounded-lg bg-gradient-to-r from-github-accent-fg to-github-accent-emphasis text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2'
          onClick={() => {
            /* Mint functionality will be added later */
          }}
        >
          <IconCertificate className='w-4 h-4' />
          Mint Profile NFT
        </button>
      </div>
    </div>
  )

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
