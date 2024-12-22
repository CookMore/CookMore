import {
  IconUser,
  IconChefHat,
  IconLink,
  IconBriefcase,
  IconCertificate,
  IconClock,
  IconBuilding,
  IconStore,
  IconUsers,
  IconCrown,
  IconTrophy,
} from '@/app/api/icons'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'

export interface Step {
  id: string
  label: string
  description?: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  tier: ProfileTier
}

export const steps: Step[] = [
  // Free Tier Steps
  {
    id: 'basic-info',
    label: 'Basic Information',
    description: 'Your name, bio, and avatar',
    icon: IconUser,
    tier: ProfileTier.FREE,
  },
  {
    id: 'culinary-info',
    label: 'Culinary Information',
    description: 'Your cooking expertise and specialties',
    icon: IconChefHat,
    tier: ProfileTier.FREE,
  },
  {
    id: 'social-links',
    label: 'Social Links',
    description: 'Connect your social media profiles',
    icon: IconLink,
    tier: ProfileTier.FREE,
  },

  // Pro Tier Steps
  {
    id: 'experience',
    label: 'Experience',
    description: 'Your professional experience',
    icon: IconBriefcase,
    tier: ProfileTier.PRO,
  },
  {
    id: 'certifications',
    label: 'Certifications',
    description: 'Your professional certifications',
    icon: IconCertificate,
    tier: ProfileTier.PRO,
  },
  {
    id: 'availability',
    label: 'Availability',
    description: 'Your availability for work',
    icon: IconClock,
    tier: ProfileTier.PRO,
  },

  // Group Tier Steps
  {
    id: 'organization-info',
    label: 'Organization Info',
    description: 'Information about your organization',
    icon: IconBuilding,
    tier: ProfileTier.GROUP,
  },
  {
    id: 'business-operations',
    label: 'Business Operations',
    description: 'Your business operations details',
    icon: IconStore,
    tier: ProfileTier.GROUP,
  },
  {
    id: 'team',
    label: 'Team',
    description: 'Your team structure',
    icon: IconUsers,
    tier: ProfileTier.GROUP,
  },

  // OG Tier Steps
  {
    id: 'og-preferences',
    label: 'OG Preferences',
    description: 'Your exclusive OG member preferences',
    icon: IconCrown,
    tier: ProfileTier.OG,
  },
  {
    id: 'og-showcase',
    label: 'OG Showcase',
    description: 'Showcase your exclusive recipes and achievements',
    icon: IconTrophy,
    tier: ProfileTier.OG,
  },
  {
    id: 'og-network',
    label: 'OG Network',
    description: 'Connect with other OG members',
    icon: IconUsers,
    tier: ProfileTier.OG,
  },
]

// Helper function to get steps for a specific tier
export function getStepsForTier(tier: ProfileTier) {
  console.log('8. getStepsForTier called with tier:', ProfileTier[tier])

  if (!tier) {
    console.warn('Warning: No tier provided to getStepsForTier')
    return []
  }

  const filteredSteps = steps.filter((step) => {
    const shouldInclude = (() => {
      switch (tier) {
        case ProfileTier.OG:
          return true
        case ProfileTier.GROUP:
          return (
            step.tier === ProfileTier.FREE ||
            step.tier === ProfileTier.PRO ||
            step.tier === ProfileTier.GROUP
          )
        case ProfileTier.PRO:
          return step.tier === ProfileTier.FREE || step.tier === ProfileTier.PRO
        case ProfileTier.FREE:
        default:
          return step.tier === ProfileTier.FREE
      }
    })()

    console.log(`Step ${step.id} included:`, shouldInclude)
    return shouldInclude
  })

  console.log(
    '9. Filtered steps:',
    filteredSteps.map((step) => ({
      id: step.id,
      tier: ProfileTier[step.tier],
    }))
  )

  return filteredSteps
}

console.log('[Steps] Getting steps for tier:', {
  FREE: getStepsForTier(ProfileTier.FREE),
  PRO: getStepsForTier(ProfileTier.PRO),
  GROUP: getStepsForTier(ProfileTier.GROUP),
})
