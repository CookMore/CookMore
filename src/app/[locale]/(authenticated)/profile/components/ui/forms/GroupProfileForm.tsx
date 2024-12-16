'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useOptimistic, useTransition } from 'react'
import { useProfileSystem } from '@/lib/web3/hooks/useProfileSystem'
import { useAccessControl } from '@/lib/auth/hooks/useAccessControl'
import { useNFTTiers } from '@/lib/web3'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { cn } from '@/lib/utils/utils'
import { profileSchema } from '@/lib/validations/profile'
import { createEmptyProProfile } from '@/lib/utils/profile'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { GroupProfileMetadata } from '@/app/[locale]/(authenticated)/profile/profile'
import { toast } from 'sonner'

interface GroupProfileFormProps {
  initialData?: GroupProfileMetadata
  onSubmit?: (data: GroupProfileMetadata) => Promise<void>
  currentSection: number
}

export default function GroupProfileForm({
  initialData,
  onSubmit,
  currentSection,
}: GroupProfileFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const [optimisticData, setOptimisticData] = useOptimistic<GroupProfileMetadata | undefined>(
    initialData
  )

  const { handleProfileSubmit, handleProfileUpdate, isLoading } = useProfileSystem()
  const { canManageProfiles } = useAccessControl()
  const { hasGroup } = useNFTTiers()

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<GroupProfileMetadata>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...initialData,
      tier: ProfileTier.GROUP,
      version: CURRENT_PROFILE_VERSION,
    } || {
      tier: ProfileTier.GROUP,
      version: CURRENT_PROFILE_VERSION,
      name: '',
      bio: '',
      avatar: '',
      baseName: '',
      social: { urls: [], labels: [] },
      preferences: {
        theme: 'system',
        notifications: true,
        displayEmail: false,
        displayLocation: false,
      },
      culinaryInfo: {
        expertise: 'professional',
        specialties: [],
        dietaryPreferences: [],
        cuisineTypes: [],
        techniques: [],
        equipment: [],
        certifications: [],
      },
      organizationInfo: {
        type: 'restaurant',
        establishedYear: '',
        size: 'small',
        team: [],
      },
      compliance: {
        certifications: [],
        licenses: [],
      },
      businessOperations: {
        operatingHours: [],
        serviceTypes: [],
        capacity: {},
      },
      achievements: {
        recipesCreated: 0,
        recipesForked: 0,
        totalLikes: 0,
        badges: [],
      },
    },
  })

  // Verify Group access
  useEffect(() => {
    if (!hasGroup) {
      toast.warning('Group Access Required', {
        description: 'You need a Group NFT to access these features.',
      })
      router.push('/profile')
    }
  }, [hasGroup, router])

  // Handle form submission with contract integration
  const handleFormSubmit = useCallback(
    async (data: GroupProfileMetadata) => {
      try {
        // Verify permissions
        const hasPermission = await canManageProfiles()
        if (!hasPermission) {
          toast.error('Permission Denied', {
            description: 'You do not have permission to manage group profiles',
          })
          return
        }

        // Verify Group NFT ownership
        if (!hasGroup) {
          toast.warning('Group Access Required', {
            description: 'You need a Group NFT to save group profile changes.',
          })
          return
        }

        setOptimisticData(data)

        startTransition(async () => {
          try {
            if (initialData?.profileId) {
              // Update existing profile
              await handleProfileUpdate(initialData.profileId, data, ProfileTier.GROUP)
            } else {
              // Create new profile
              await handleProfileSubmit(data, ProfileTier.GROUP)
            }

            // Call custom onSubmit if provided
            if (onSubmit) {
              await onSubmit(data)
            }

            toast.success('Your organization profile has been successfully updated.')

            // Save draft after successful submission
            localStorage.setItem('groupProfileDraft', JSON.stringify(data))

            router.refresh()
          } catch (error) {
            throw error
          }
        })
      } catch (error) {
        console.error('Profile submission error:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to update profile')
        setOptimisticData(initialData)
      }
    },
    [
      initialData,
      handleProfileSubmit,
      handleProfileUpdate,
      canManageProfiles,
      hasGroup,
      onSubmit,
      router,
    ]
  )

  // Updated draft loading with validation
  useEffect(() => {
    const loadDraft = async () => {
      if (initialData?.profileId) return

      const savedData = localStorage.getItem('groupProfileDraft')
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          // Validate the draft data
          const validation = profileSchema.safeParse(parsedData)
          if (validation.success) {
            reset(parsedData)
          } else {
            console.warn('Invalid draft data:', validation.error)
            localStorage.removeItem('groupProfileDraft')
          }
        } catch (error) {
          console.error('Error loading draft:', error)
          localStorage.removeItem('groupProfileDraft')
        }
      }
    }
    loadDraft()
  }, [initialData?.profileId, reset])

  // Don't render form if no Group access
  if (!hasGroup) {
    return null
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(handleFormSubmit)} className='space-y-8'>
      {/* Form sections */}
      {currentSection === 0 && <div className='space-y-4'>{/* Add your form fields here */}</div>}

      {/* Form actions */}
      <div className='sticky bottom-0 bg-github-canvas-default border-t border-github-border-default p-4 mt-8'>
        <div className='flex justify-end space-x-4 max-w-7xl mx-auto'>
          <button
            type='button'
            onClick={() => {
              reset(initialData)
              localStorage.removeItem('groupProfileDraft')
            }}
            disabled={!isDirty || isSubmitting || isPending || isLoading}
            className='px-4 py-2 text-github-fg-muted hover:text-github-fg-default
                     disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Reset
          </button>
          <button
            type='submit'
            disabled={!isDirty || isSubmitting || isPending || isLoading || !hasGroup}
            className={cn(
              'px-4 py-2 rounded-md',
              'bg-github-accent-emphasis text-white',
              'hover:bg-github-accent-emphasis/90',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center justify-center min-w-[100px]'
            )}
          >
            {isSubmitting || isPending || isLoading ? (
              <LoadingSpinner className='w-4 h-4' />
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
