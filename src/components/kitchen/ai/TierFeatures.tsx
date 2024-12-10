'use client'

import { useState, useEffect } from 'react'
import { ProfileTier } from '@/types/profile'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { tierInfo as tierConfiguration } from '@/lib/tiers'

interface TierFeaturesProps {
  currentTier?: ProfileTier
}

// Base component that handles hydration
export function TierFeatures({ currentTier = ProfileTier.FREE }: TierFeaturesProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder with same dimensions
    return <div className='mb-6 h-[40px] bg-github-canvas-subtle rounded-full animate-pulse' />
  }

  return <TierFeaturesInner currentTier={currentTier} />
}

// Inner component that contains the actual logic
function TierFeaturesInner({ currentTier }: { currentTier: ProfileTier }) {
  const router = useRouter()
  const info = tierConfiguration[currentTier]

  if (!info) {
    return null
  }

  const handleUpgradeClick = () => {
    router.push('/tier')
  }

  return (
    <div className='mb-6'>
      <div
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
          info.bgColor,
          info.color
        )}
      >
        <span>{currentTier} Features Available</span>
      </div>

      {/* Optional: Show upgrade button for non-GROUP users */}
      {currentTier !== ProfileTier.GROUP && (
        <button
          onClick={handleUpgradeClick}
          className={cn(
            'ml-4 text-sm text-github-accent-fg hover:underline',
            'transition-colors duration-200'
          )}
        >
          Upgrade for more features →
        </button>
      )}
    </div>
  )
}
