'use client'

import { usePrivy } from '@privy-io/react-auth'
import CurrentTier from '@/components/ui/CurrentTier'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function TierPage() {
  const { ready } = usePrivy()

  if (!ready) return null

  return (
    <div className='w-full'>
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold text-github-fg-default mb-4'>CookMore NFT Tiers</h1>
        <p className='text-xl text-github-fg-muted max-w-2xl mx-auto'>
          Unlock premium features and advanced tools by minting your Pro or Group NFT. Each tier
          provides unique benefits and enhanced capabilities.
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={cn(
            'grid mx-auto',
            'gap-12 xl:gap-8',
            'grid-cols-1',
            'lg:grid-cols-2 lg:max-w-[800px]',
            'xl:grid-cols-3 xl:max-w-[1400px]'
          )}
        >
          <CurrentTier />
        </div>
      </motion.div>
    </div>
  )
}
