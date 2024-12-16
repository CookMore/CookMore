'use client'

import { useNFTTiers } from '@/app/api/web3'
import { TierBadge } from '@/components/ui/TierBadge'
import { TierCard } from '@/components/ui/TierCard'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function LoadingTiers() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-12 place-items-center'>
      <div className='animate-pulse w-[22rem] h-[32.5rem] bg-github-canvas-subtle rounded-lg' />
      <div className='animate-pulse w-[22rem] h-[32.5rem] bg-github-canvas-subtle rounded-lg' />
      <div className='animate-pulse w-[22rem] h-[32.5rem] bg-github-canvas-subtle rounded-lg' />
    </div>
  )
}

// Base component that handles hydration
export default function CurrentTier() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <LoadingTiers />
  }

  return <CurrentTierInner />
}

// Inner component that contains the actual logic
function CurrentTierInner() {
  const { hasGroup, hasPro, isLoading } = useNFTTiers()
  const currentTier = hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE

  if (isLoading) {
    return <LoadingTiers />
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <h2 className='text-2xl font-bold'>Current Tier</h2>
        <TierBadge tier={currentTier} />
      </div>
      <TierCard tier={currentTier} currentTier={currentTier} />
      <div className='flex flex-col items-center px-4 md:px-6 lg:px-8'>
        <div className='w-full max-w-7xl'>
          <div className='mb-12 text-center'>
            <h1 className='text-3xl font-bold text-github-fg-default'>Available NFT Tiers</h1>
            <p className='mt-2 text-github-fg-muted'>
              Unlock premium features and advanced tools by minting your Pro or Group NFT. Each tier
              provides unique benefits and enhanced capabilities.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-12 place-items-center'>
            {[ProfileTier.FREE, ProfileTier.PRO, ProfileTier.GROUP].map((tier) => (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 * Object.values(ProfileTier).indexOf(tier),
                }}
              >
                <TierCard tier={tier} currentTier={currentTier || undefined} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
