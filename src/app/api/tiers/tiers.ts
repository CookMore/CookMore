import { IconChefHat, IconStar, IconBuilding } from '@/app/api/icons'
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
}

export const tierStyles = {
  [ProfileTier.FREE]: {
    icon: IconChefHat,
    color: 'text-github-fg-default',
    bgColor: 'bg-github-canvas-subtle',
    borderColor: 'border-github-border-default',
    hoverBorder: 'hover:border-github-border-muted',
    badgeColor: 'bg-github-fg-muted',
    iconBg: 'bg-github-canvas-subtle',
    buttonVariant: 'outline',
    buttonText: 'Current Tier',
    buttonDisabled: true,
  },
  [ProfileTier.PRO]: {
    icon: IconStar,
    color: 'text-github-accent-fg',
    bgColor: 'bg-github-accent-subtle',
    borderColor: 'border-github-accent-emphasis',
    hoverBorder: 'hover:border-github-accent-muted',
    badgeColor: 'bg-github-accent-emphasis',
    iconBg: 'bg-github-accent-muted',
    buttonVariant: 'default',
    buttonText: 'Upgrade to Pro',
    buttonDisabled: false,
    accentColor: 'text-github-accent-fg',
    accentBg: 'bg-github-accent-subtle',
    accentBorder: 'border-github-accent-emphasis',
    accentHover: 'hover:bg-github-accent-muted',
  },
  [ProfileTier.GROUP]: {
    icon: IconBuilding,
    color: 'text-github-success-fg',
    bgColor: 'bg-github-success-subtle',
    borderColor: 'border-github-success-emphasis',
    hoverBorder: 'hover:border-github-success-muted',
    badgeColor: 'bg-github-success-emphasis',
    iconBg: 'bg-github-success-muted',
    buttonVariant: 'default',
    buttonText: 'Upgrade to Group',
    buttonDisabled: false,
    accentColor: 'text-github-success-fg',
    accentBg: 'bg-github-success-subtle',
    accentBorder: 'border-github-success-emphasis',
    accentHover: 'hover:bg-github-success-muted',
  },
} as const

// Helper function to get icon component
export const getIconComponent = (iconType: 'chef' | 'star' | 'building') => {
  switch (iconType) {
    case 'chef':
      return IconChefHat
    case 'star':
      return IconStar
    case 'building':
      return IconBuilding
  }
}

// Contract addresses
export const PRO_CONTRACT = '0xa859Ca4cF5Fc201E710C1A8Dc8540beaa9878C02'
export const GROUP_CONTRACT = '0x6c927C8F1661460c5f3adDcd26d7698910077492'

// Helper to get contract address by tier
export const getContractAddress = (tier: ProfileTier) => {
  switch (tier) {
    case ProfileTier.PRO:
      return PRO_CONTRACT
    case ProfileTier.GROUP:
      return GROUP_CONTRACT
    default:
      return null
  }
}

// Helper to get tier info with styling
export const getTierInfo = (tier: ProfileTier) => {
  return {
    ...tierInfo[tier],
    ...tierStyles[tier],
  }
}

// Helper to check if tier is paid
export const isPaidTier = (tier: ProfileTier) => {
  return tier === ProfileTier.PRO || tier === ProfileTier.GROUP
}

// Helper to get next tier
export const getNextTier = (currentTier: ProfileTier): ProfileTier | null => {
  switch (currentTier) {
    case ProfileTier.FREE:
      return ProfileTier.PRO
    case ProfileTier.PRO:
      return ProfileTier.GROUP
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
    default:
      return null
  }
}
