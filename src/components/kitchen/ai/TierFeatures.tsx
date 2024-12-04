import { ProfileTier } from '@/types/profile'
import { cn } from '@/lib/utils'

const TIER_FEATURES = {
  [ProfileTier.FREE]: {
    title: 'Basic Features',
    features: ['Simple recipe suggestions', 'Basic cooking tips', 'Up to 10 questions per day'],
    color: 'text-github-fg-muted',
    bgColor: 'bg-github-canvas-subtle',
  },
  [ProfileTier.PRO]: {
    title: 'Pro Features',
    features: [
      'Advanced recipe modifications',
      'Professional techniques',
      'Ingredient substitutions',
      'Up to 50 questions per day',
    ],
    color: 'text-github-accent-fg',
    bgColor: 'bg-github-accent-subtle',
  },
  [ProfileTier.GROUP]: {
    title: 'Group Features',
    features: [
      'Team recipe planning',
      'Bulk cooking instructions',
      'Cost analysis',
      'Equipment recommendations',
      'Up to 100 questions per day',
    ],
    color: 'text-github-success-fg',
    bgColor: 'bg-github-success-subtle',
  },
}

export function TierFeatures({ currentTier }: { currentTier: ProfileTier }) {
  const tierInfo = TIER_FEATURES[currentTier]

  return (
    <div className='mb-6'>
      <div
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
          tierInfo.bgColor,
          tierInfo.color
        )}
      >
        <span>{tierInfo.title} Available</span>
      </div>

      {/* Optional: Show upgrade button for non-GROUP users */}
      {currentTier !== ProfileTier.GROUP && (
        <button
          onClick={() => (window.location.href = '/kitchen/tier')}
          className='ml-4 text-sm text-github-accent-fg hover:underline'
        >
          Upgrade for more features →
        </button>
      )}
    </div>
  )
}
