'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useOptimistic } from 'react'
import { toast } from 'sonner'
import { useProfileSystem } from '@/lib/web3/hooks/useProfileSystem'
import { useAccessControl } from '@/lib/auth/hooks/useAccessControl'
import { useProfile } from '@/lib/auth/hooks/useProfile'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils'
import { profileSchema } from '@/lib/validations/profile'
import { createEmptyFreeProfile } from '@/lib/utils/profile'
import type { FreeProfileMetadata } from '@/app/[locale]/(authenticated)/profile/profile'
import { BasicInfoSection } from '../sections/BasicInfoSection'
import { CulinaryInfoSection } from '../sections/CulinaryInfoSection'
import { SocialLinksSection } from '../sections/SocialLinksSection'
import { EducationSection } from '../sections/EducationSection'

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
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const [optimisticData, setOptimisticData] = useOptimistic<FreeProfileMetadata | undefined>(
    initialData
  )

  const { handleProfileSubmit, handleProfileUpdate, isLoading } = useProfileSystem()
  const { canManageProfiles } = useAccessControl()
  const { hasProAccess, hasGroupAccess, currentTier } = useProfile()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<FreeProfileMetadata>({
    defaultValues: initialData || createEmptyFreeProfile(),
    resolver: zodResolver(profileSchema),
  })

  const handleFormSubmit = useCallback(
    async (data: FreeProfileMetadata) => {
      try {
        // Validate permissions
        const hasPermission = await canManageProfiles()
        if (!hasPermission) {
          toast.error('Permission Denied', {
            description: 'You do not have permission to manage profiles',
          })
          return
        }

        setOptimisticData(data)

        startTransition(async () => {
          try {
            if (initialData?.profileId) {
              // Update existing profile
              await handleProfileUpdate(initialData.profileId, data, ProfileTier.FREE)
            } else {
              // Create new profile
              await handleProfileSubmit(data, ProfileTier.FREE)
            }

            // Call custom onSubmit if provided
            if (onSubmit) {
              await onSubmit(data)
            }

            toast.success('Your profile has been successfully updated.')

            // Save draft after successful submission
            localStorage.setItem('freeProfileDraft', JSON.stringify(data))

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
    [initialData, handleProfileSubmit, handleProfileUpdate, canManageProfiles, onSubmit, router]
  )

  // Load draft data
  useEffect(() => {
    if (initialData?.profileId) return

    const savedData = localStorage.getItem('freeProfileDraft')
    if (savedData) {
      try {
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

      <div className='flex justify-between space-x-4'>
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
        <div className='flex space-x-4'>
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
            ) : initialData?.profileId ? (
              'Save Changes'
            ) : (
              'Create Profile'
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
