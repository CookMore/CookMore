'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useOptimistic } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useProfileSystem } from '@/hooks/useProfileSystem'
import { useAccessControl } from '@/hooks/useAccessControl'
import { useProfile } from '@/hooks/useProfile'
import { ProfileTier } from '@/types/profile'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils'
import { profileSchema } from '@/lib/validations/profile'
import type { FreeProfileMetadata } from '@/types/profile'
import BasicInfoSection from './BasicInfoSection'
import CulinaryInfoSection from './CulinaryInfoSection'
import SocialLinksSection from './SocialLinksSection'
import EducationSection from './EducationSection'

interface FreeProfileFormProps {
  initialData?: FreeProfileMetadata
  onSubmit?: (data: FreeProfileMetadata) => Promise<void>
  currentSection: number
}

export default function FreeProfileForm({
  initialData,
  onSubmit,
  currentSection,
}: FreeProfileFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const [, setOptimisticData] = useOptimistic<FreeProfileMetadata | undefined>(initialData)

  const { handleProfileSubmit, handleProfileUpdate, isLoading } = useProfileSystem()
  const { canManageProfiles } = useAccessControl()
  const { hasProAccess, hasGroupAccess, currentTier } = useProfile()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<FreeProfileMetadata>({
    defaultValues: {
      ...initialData,
      tier: ProfileTier.FREE,
      version: CURRENT_PROFILE_VERSION,
    } || {
      tier: ProfileTier.FREE,
      version: CURRENT_PROFILE_VERSION,
      name: '',
      bio: '',
      avatar: '',
      social: { urls: [], labels: [] },
      preferences: {
        theme: 'system',
        notifications: true,
        displayEmail: false,
        displayLocation: false,
      },
      culinaryInfo: {
        expertise: 'beginner',
        specialties: [],
        dietaryPreferences: [],
        cuisineTypes: [],
        techniques: [],
        equipment: [],
      },
      achievements: {
        recipesCreated: 0,
        recipesForked: 0,
        totalLikes: 0,
        badges: [],
      },
    },
    resolver: zodResolver(profileSchema),
  })

  const handleFormSubmit = useCallback(
    async (data: FreeProfileMetadata) => {
      try {
        // Validate permissions
        const hasPermission = await canManageProfiles()
        if (!hasPermission) {
          toast({
            title: 'Permission Denied',
            description: 'You do not have permission to manage profiles',
            variant: 'destructive',
          })
          return
        }

        // Set optimistic data
        setOptimisticData(data)

        // Use transition for better UX
        startTransition(async () => {
          try {
            if (initialData?.profileId) {
              await handleProfileUpdate(initialData.profileId, data, ProfileTier.FREE)
            } else {
              await handleProfileSubmit(data, ProfileTier.FREE)
            }

            // Call custom onSubmit if provided
            if (onSubmit) {
              await onSubmit(data)
            }

            // Save successful state
            toast({
              title: 'Success',
              description: initialData
                ? 'Profile updated successfully'
                : 'Profile created successfully',
            })

            // Save draft and refresh
            localStorage.setItem('freeProfileDraft', JSON.stringify(data))
            router.refresh()
          } catch (error) {
            console.error('Profile submission error:', error)
            setOptimisticData(initialData)
            throw error // Re-throw to be caught by outer try-catch
          }
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to save profile',
          variant: 'destructive',
        })
      }
    },
    [
      initialData,
      handleProfileSubmit,
      handleProfileUpdate,
      canManageProfiles,
      onSubmit,
      router,
      toast,
      setOptimisticData,
    ]
  )

  // Load draft data
  useEffect(() => {
    if (initialData?.profileId) return // Skip for existing profiles

    try {
      const savedData = localStorage.getItem('freeProfileDraft')
      if (!savedData) return

      const parsedData = JSON.parse(savedData)
      const validation = profileSchema.safeParse(parsedData)

      if (validation.success) {
        reset(parsedData)
      } else {
        console.warn('Invalid draft data:', validation.error)
        localStorage.removeItem('freeProfileDraft')
      }
    } catch (error) {
      console.error('Error loading draft:', error)
      localStorage.removeItem('freeProfileDraft')
    }
  }, [initialData?.profileId, reset])

  // Render the appropriate section based on currentSection
  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <BasicInfoSection control={control} errors={errors} />
      case 1:
        return <CulinaryInfoSection control={control} errors={errors} />
      case 2:
        return <SocialLinksSection control={control} errors={errors} />
      case 3:
        return <EducationSection control={control} errors={errors} />
      default:
        return <BasicInfoSection control={control} errors={errors} />
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(handleFormSubmit)} className='space-y-8'>
      {renderSection()}

      <div className='flex justify-end space-x-4'>
        <button
          type='button'
          onClick={() => {
            reset(initialData)
            localStorage.removeItem('freeProfileDraft')
          }}
          disabled={!isDirty || isSubmitting || isPending || isLoading}
          className='px-4 py-2 text-github-fg-muted hover:text-github-fg-default
                   disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Reset
        </button>
        <button
          type='submit'
          disabled={!isDirty || isSubmitting || isPending || isLoading}
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
