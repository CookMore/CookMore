import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FreeProfileSchema,
  ProProfileSchema,
  GroupProfileSchema,
} from '@/lib/validations/profile.validation'
import {
  ProfileTier,
  FreeProfileMetadata,
  ProProfileMetadata,
  GroupProfileMetadata,
} from '@/types/profile'

type ProfileFormData = FreeProfileMetadata | ProProfileMetadata | GroupProfileMetadata

export function useProfileForm(tier: ProfileTier, initialData?: ProfileFormData) {
  const schema = {
    [ProfileTier.FREE]: FreeProfileSchema,
    [ProfileTier.PRO]: ProProfileSchema,
    [ProfileTier.GROUP]: GroupProfileSchema,
  }[tier]

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      version: '1.2',
      preferences: {
        theme: 'system',
        notifications: true,
        displayEmail: false,
        displayLocation: false,
      },
      social: {
        urls: [],
        labels: [],
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
      ...initialData,
    },
  })

  return {
    form,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    errors: form.formState.errors,
  }
}

// Helper types for form sections
export type ProfileFormSectionProps = {
  control: ReturnType<typeof useProfileForm>['form']['control']
  errors: ReturnType<typeof useProfileForm>['form']['formState']['errors']
  isPro?: boolean
  isGroup?: boolean
}

// Helper function to determine if a field should be shown based on tier
export function shouldShowField(fieldTier: ProfileTier, currentTier: ProfileTier): boolean {
  const tierOrder = [ProfileTier.FREE, ProfileTier.PRO, ProfileTier.GROUP]
  return tierOrder.indexOf(currentTier) >= tierOrder.indexOf(fieldTier)
}
