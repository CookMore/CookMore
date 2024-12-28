'use client'

import { motion } from 'framer-motion'
import { ChefHat, Crown, Users, Star } from 'lucide-react'
import { cn } from '@/app/api/utils/utils'
import { Button } from '@/app/api/components/ui/button'
import { IconEye, IconCurrencyEthereum } from '@tabler/icons-react'
import type { NFTTier } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'

interface ProfileHeaderProps {
  tier: NFTTier
  name: string
  canMint: boolean
  onPreview: () => void
  onMint: () => void
  isPreviewOpen?: boolean
  isMinting?: boolean
}

const tierIcons = {
  free: ChefHat,
  pro: Crown,
  group: Users,
  og: Star,
} as const

const tierColors = {
  free: 'text-blue-500 bg-blue-500/10',
  pro: 'text-purple-500 bg-purple-500/10',
  group: 'text-amber-500 bg-amber-500/10',
  og: 'text-emerald-500 bg-emerald-500/10',
} as const

export function ProfileHeader({
  tier,
  name,
  canMint,
  onPreview,
  onMint,
  isPreviewOpen,
  isMinting,
}: ProfileHeaderProps) {
  const TierIcon = tierIcons[tier]

  return (
    <div className='space-y-6 p-6 border-b border-github-border-default'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight'>{name || 'My Profile'}</h1>
          <p className='text-github-fg-muted'>Manage your chef profile and NFT</p>
        </div>
        <div className='flex items-center gap-4'>
          {/* Action Buttons */}
          <div className='flex gap-2'>
            <Button
              variant='secondary'
              onClick={onPreview}
              className='flex items-center gap-2'
              disabled={isPreviewOpen}
            >
              <IconEye className='w-4 h-4' />
              Preview
            </Button>
            <Button
              onClick={onMint}
              disabled={!canMint || isMinting}
              className={cn(
                'flex items-center gap-2 transition-colors',
                canMint
                  ? 'bg-github-success-emphasis hover:bg-github-success-emphasis/90'
                  : 'bg-github-canvas-subtle'
              )}
            >
              {isMinting ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
                  Minting...
                </>
              ) : (
                <>
                  <IconCurrencyEthereum className='w-4 h-4' />
                  Mint Profile
                </>
              )}
            </Button>
          </div>
          {/* Tier Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full', tierColors[tier])}
          >
            <TierIcon className='w-5 h-5' />
            <span className='font-medium capitalize'>{tier}</span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
