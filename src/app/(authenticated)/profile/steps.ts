import { ProfileTier } from '@/types/profile'

// Define the ProfileStep type
export type ProfileStep = {
  id: string
  label: string
}

export const freeProfileSteps = [
  { id: 'basic-info', label: 'Basic Information' },
  { id: 'education', label: 'Education' },
  { id: 'culinary-info', label: 'Culinary Information' },
  { id: 'social-links', label: 'Social Links' },
]

export const proProfileSteps = [
  ...freeProfileSteps,
  { id: 'experience', label: 'Experience' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'availability', label: 'Availability' },
  { id: 'marketing', label: 'Marketing & Branding' },
]

export const groupProfileSteps = [
  ...proProfileSteps,
  { id: 'organization-info', label: 'Organization Info' },
  { id: 'business-operations', label: 'Business Operations' },
  { id: 'team', label: 'Team' },
  { id: 'suppliers', label: 'Suppliers' },
  { id: 'compliance', label: 'Compliance' },
]

export const getStepsForTier = (tier: ProfileTier): ProfileStep[] => {
  switch (tier) {
    case ProfileTier.FREE:
      return [...freeProfileSteps]
    case ProfileTier.PRO:
      return [...proProfileSteps]
    case ProfileTier.GROUP:
      return [...groupProfileSteps]
    default:
      return [...freeProfileSteps]
  }
}
