import { ProfileTier } from '@/app/api/types/profile'

export const tierInfo = {
  [ProfileTier.FREE]: {
    name: 'Lite',
    description: 'Basic features for casual users',
    price: 'Free',
  },
  [ProfileTier.PRO]: {
    name: 'Pro',
    description: 'Advanced features for power users',
    price: '0.1 ETH',
  },
  [ProfileTier.GROUP]: {
    name: 'Group',
    description: 'Collaborative features for teams',
    price: '0.2 ETH',
  },
}

export const tierStyles = {
  [ProfileTier.FREE]: {
    borderColor: 'border-github-border-default',
    bgColor: 'bg-github-canvas-default',
    color: 'text-github-fg-default',
  },
  [ProfileTier.PRO]: {
    borderColor: 'border-github-accent-emphasis',
    bgColor: 'bg-github-accent-subtle',
    color: 'text-github-accent-fg',
  },
  [ProfileTier.GROUP]: {
    borderColor: 'border-github-success-emphasis',
    bgColor: 'bg-github-success-subtle',
    color: 'text-github-success-fg',
  },
}
