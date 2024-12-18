import { IconChefHat, IconStar, IconBuilding, IconCrown } from '@/app/api/icons'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'

export const tierInfo = {
  [ProfileTier.FREE]: {
    title: 'Free',
    description: 'Perfect for home cooks',
    price: '$0',
    features: [
      'Unlimited public recipes',
      'Basic recipe versioning',
      'Community features',
      '$1 platform fee per Recipe NFT minted',
    ],
    limitations: [
      'Limited to 5 recipes per month',
      'Basic analytics only',
      'No custom branding',
      'Community support only',
    ],
  },
  [ProfileTier.PRO]: {
    title: 'Pro',
    description: 'For serious chefs',
    price: '$25 USDC',
    features: [
      'Soul Bound Token',
      'No platform fees',
      'Advanced recipe features',
      'Priority support',
      'Early access to new features',
      'Custom profile branding',
    ],
  },
  [ProfileTier.GROUP]: {
    title: 'Group',
    description: 'For teams & restaurants',
    price: '$100 USDC',
    features: [
      'All Pro features',
      'Team collaboration',
      'Analytics dashboard',
      'Custom branding',
      'API access',
      'Dedicated support',
    ],
  },
  [ProfileTier.OG]: {
    title: 'OG',
    description: 'Limited edition for early adopters',
    price: '$150 USDC',
    features: [
      'All Group features',
      'Lifetime platform fee waiver',
      'Exclusive OG badge',
      'Early access to all features',
      'Priority feature requests',
      'Direct access to dev team',
      'Limited to first 500 members',
    ],
  },
}

export const tierStyles = {
  [ProfileTier.FREE]: {
    borderColor: 'border-github-border-default',
    bgColor: 'bg-github-canvas-default',
    color: 'text-github-fg-default',
    iconBg: 'bg-github-canvas-subtle',
    badgeColor: 'bg-github-fg-muted',
    icon: IconChefHat,
  },
  [ProfileTier.PRO]: {
    borderColor: 'border-github-accent-emphasis',
    bgColor: 'bg-github-accent-subtle',
    color: 'text-github-accent-fg',
    iconBg: 'bg-github-accent-muted',
    badgeColor: 'bg-github-accent-emphasis',
    icon: IconStar,
  },
  [ProfileTier.GROUP]: {
    borderColor: 'border-github-success-emphasis',
    bgColor: 'bg-github-success-subtle',
    color: 'text-github-success-fg',
    iconBg: 'bg-github-success-muted',
    badgeColor: 'bg-github-success-emphasis',
    icon: IconBuilding,
  },
  [ProfileTier.OG]: {
    borderColor: 'border-github-done-emphasis',
    bgColor: 'bg-github-done-subtle',
    color: 'text-github-done-fg',
    iconBg: 'bg-github-done-muted',
    badgeColor: 'bg-github-done-emphasis',
    icon: IconCrown,
  },
}

// Helper function to get icon component
export const getIconComponent = (iconType: 'chef' | 'star' | 'building' | 'crown') => {
  switch (iconType) {
    case 'chef':
      return IconChefHat
    case 'star':
      return IconStar
    case 'building':
      return IconBuilding
    case 'crown':
      return IconCrown
  }
}

// Contract addresses
export const TIER_CONTRACT_ADDRESS = '0x947b40801581E896C29dD73f9C7f5dd710877b64' as const
// Helper to get tier info with styling
export const getTierInfo = (tier: ProfileTier) => {
  return {
    ...tierInfo[tier],
    ...tierStyles[tier],
  }
}

// Helper to check if tier is paid
export const isPaidTier = (tier: ProfileTier) => {
  return tier !== ProfileTier.FREE
}

// Helper to get next tier
export const getNextTier = (currentTier: ProfileTier): ProfileTier | null => {
  switch (currentTier) {
    case ProfileTier.FREE:
      return ProfileTier.PRO
    case ProfileTier.PRO:
      return ProfileTier.GROUP
    case ProfileTier.GROUP:
      return ProfileTier.OG
    default:
      return null
  }
}

// Helper to get tier requirements
export const getTierRequirements = (tier: ProfileTier) => {
  switch (tier) {
    case ProfileTier.PRO:
      return {
        minRecipes: 5,
        minFollowers: 100,
        minRating: 4.5,
      }
    case ProfileTier.GROUP:
      return {
        minRecipes: 20,
        minFollowers: 1000,
        minRating: 4.8,
        requiresVerification: true,
      }
    case ProfileTier.OG:
      return {
        minRecipes: 50,
        minFollowers: 5000,
        minRating: 4.9,
        requiresVerification: true,
        requiresInvitation: true,
      }
    default:
      return null
  }
}
