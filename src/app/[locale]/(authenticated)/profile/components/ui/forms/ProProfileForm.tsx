'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useOptimistic } from 'react'
import { toast } from 'sonner'
import { useProfileSystem } from '@/app/[locale]/(authenticated)/profile/components/hooks/useProfileSystem'
import { useAccessControl } from '@/app/api/auth/hooks/useAccessControl'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { usePrivy } from '@privy-io/react-auth'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { LoadingSpinner } from '@/app/api/loading/LoadingSpinner'
import { cn } from '@/app/api/utils/utils'
import { proProfileSchema } from '@/app/[locale]/(authenticated)/profile/validations/profile'
import type { ProProfileMetadata } from '@/app/[locale]/(authenticated)/profile/profile'

interface ProProfileFormProps {
  initialData?: ProProfileMetadata
  onSubmit?: (data: ProProfileMetadata) => Promise<void>
  currentSection: number
}

export default function ProProfileForm({
  initialData,
  onSubmit,
  currentSection,
}: ProProfileFormProps) {
  const router = useRouter()
  const { user } = usePrivy()
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const [, setOptimisticData] = useOptimistic<ProProfileMetadata | undefined>(initialData)

  const { handleProfileSubmit, handleProfileUpdate, isLoading } = useProfileSystem()
  const { canManageProfiles } = useAccessControl()
  const { currentTier } = useNFTTiers()
  const { profile } = useProfile(user?.wallet?.address)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProProfileMetadata>({
    resolver: zodResolver(proProfileSchema),
    defaultValues: {
      ...initialData,
      tier: ProfileTier.PRO,
      version: CURRENT_PROFILE_VERSION,
    } || {
      tier: ProfileTier.PRO,
      version: CURRENT_PROFILE_VERSION,
      name: '',
      bio: '',
      avatar: '',
      title: '',
      company: '',
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
      experience: {
        current: undefined,
        history: [],
      },
      education: [],
      languages: [],
      availability: {
        forHire: false,
        consulting: false,
        collaborations: false,
        teaching: false,
      },
      achievements: {
        recipesCreated: 0,
        recipesForked: 0,
        totalLikes: 0,
        badges: [],
      },
    },
  })

  // Watch for changes to optimize re-renders
  const watchedFields = watch(['experience.current', 'education', 'languages', 'availability'])

  // Verify Pro access
  useEffect(() => {
    if (!profile) {
      toast.error('Pro Access Required', {
        description: 'You need a Pro NFT to access these features.',
      })
      router.push('/profile')
    }
  }, [profile, router, toast])

  // Handle form submission with contract integration
  const handleFormSubmit = useCallback(
    async (data: ProProfileMetadata) => {
      try {
        // Verify permissions
        const hasPermission = await canManageProfiles()
        if (!hasPermission) {
          toast({
            title: 'Permission Denied',
            description: 'You do not have permission to manage pro profiles',
            variant: 'destructive',
          })
          return
        }

        // Verify Pro NFT ownership
        if (!profile) {
          toast({
            title: 'Pro Access Required',
            description: 'You need a Pro NFT to save pro profile changes.',
            variant: 'destructive',
          })
          return
        }

        setOptimisticData(data)

        startTransition(async () => {
          if (initialData?.profileId) {
            // Update existing profile
            await handleProfileUpdate(initialData.profileId, data, ProfileTier.PRO)
          } else {
            // Create new profile
            await handleProfileSubmit(data, ProfileTier.PRO)
          }

          // Call custom onSubmit if provided
          if (onSubmit) {
            await onSubmit(data)
          }

          toast({
            title: 'Success',
            description: 'Your professional profile has been successfully updated.',
            variant: 'default',
          })

          // Save draft after successful submission
          localStorage.setItem('proProfileDraft', JSON.stringify(data))

          router.refresh()
        })
      } catch (error) {
        console.error('Profile submission error:', error)
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to update profile',
          variant: 'destructive',
        })
        setOptimisticData(initialData)
      }
    },
    [
      initialData,
      handleProfileSubmit,
      handleProfileUpdate,
      canManageProfiles,
      profile,
      onSubmit,
      router,
      toast,
    ]
  )

  // Updated draft loading with validation
  useEffect(() => {
    const loadDraft = async () => {
      if (initialData?.profileId) return

      const savedData = localStorage.getItem('proProfileDraft')
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          // Validate the draft data
          const validation = proProfileSchema.safeParse(parsedData)
          if (validation.success) {
            reset(parsedData)
          } else {
            console.warn('Invalid draft data:', validation.error)
            localStorage.removeItem('proProfileDraft')
          }
        } catch (error) {
          console.error('Error loading draft:', error)
          localStorage.removeItem('proProfileDraft')
        }
      }
    }
    loadDraft()
  }, [initialData?.profileId, reset])

  // Don't render form if no Pro access
  if (!profile) {
    return null
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(handleFormSubmit)} className='space-y-8'>
      {/* ... existing form sections ... */}

      {/* Updated buttons section */}
      <div className='flex justify-end space-x-4'>
        <button
          type='button'
          onClick={() => {
            reset(initialData)
            localStorage.removeItem('proProfileDraft')
          }}
          disabled={!isDirty || isSubmitting || isPending || isLoading}
          className='px-4 py-2 text-github-fg-muted hover:text-github-fg-default
                   disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Reset
        </button>
        <button
          type='submit'
          disabled={!isDirty || isSubmitting || isPending || isLoading || !profile}
          className={cn(
            'px-4 py-2 rounded-md',
            'bg-github-accent-emphasis text-white',
            'hover:bg-github-accent-emphasis/90',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center justify-center min-w-[100px]'
          )}
        >
          {isSubmitting || isPending || isLoading ? (
            <LoadingSpinner className='w-5 h-5' />
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  )
}
