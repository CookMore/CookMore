import { ProfileTier } from '@/types/profile'

export interface Step {
  id: string
  label: string
  description?: string
}

const BASE_STEPS: Step[] = [
  {
    id: 'basic-info',
    label: 'Basic Information',
    description: 'Your name, bio, and avatar',
  },
  {
    id: 'culinary-info',
    label: 'Culinary Information',
    description: 'Your cooking expertise and specialties',
  },
  {
    id: 'social-links',
    label: 'Social Links',
    description: 'Connect your social media profiles',
  },
]

const PRO_STEPS: Step[] = [
  ...BASE_STEPS,
  {
    id: 'experience',
    label: 'Experience',
    description: 'Your professional experience',
  },
  {
    id: 'certifications',
    label: 'Certifications',
    description: 'Your professional certifications',
  },
  {
    id: 'availability',
    label: 'Availability',
    description: 'Your availability for work',
  },
]

const GROUP_STEPS: Step[] = [
  ...PRO_STEPS,
  {
    id: 'organization-info',
    label: 'Organization Info',
    description: 'Information about your organization',
  },
  {
    id: 'business-operations',
    label: 'Business Operations',
    description: 'Your business operations details',
  },
  {
    id: 'team',
    label: 'Team',
    description: 'Your team structure',
  },
]

export function getStepsForTier(tier: ProfileTier): Step[] {
  switch (tier) {
    case ProfileTier.GROUP:
      return GROUP_STEPS
    case ProfileTier.PRO:
      return PRO_STEPS
    case ProfileTier.FREE:
    default:
      return BASE_STEPS
  }
}
