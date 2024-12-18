'use client'

import { useState, useEffect } from 'react'
import { IconArrowUpRight, IconGift } from '@/app/api/icons'
import { Button } from '@/app/api/components/ui/Button'
import { cn } from '@/app/api/utils/utils'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { useTierMint } from '../hooks/useTierMint'
import { GiftTierModal } from './GiftTierModal'
import { usePrivy } from '@privy-io/react-auth'
import { usePublicClient } from 'wagmi'

interface TierActionButtonProps {
  currentTier: ProfileTier | null
  targetTier: ProfileTier
  onMintSuccess?: () => void
  showGift?: boolean
  className?: string
}

export function TierActionButton({
  currentTier,
  targetTier,
  onMintSuccess,
  showGift = true,
  className,
}: TierActionButtonProps) {
  const [mounted, setMounted] = useState(false)
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false)
  const { authenticated } = usePrivy()
  const publicClient = usePublicClient()
  const { mintTier, adminMintTier, isLoading: mintLoading } = useTierMint(onMintSuccess)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAction = async () => {
    try {
      if (currentTier === ProfileTier.PRO && targetTier === ProfileTier.GROUP) {
        // For upgrade, we use the Group mint function
        await mintTier('Group')
      } else {
        await mintTier(
          targetTier === ProfileTier.GROUP ? 'Group' : targetTier === ProfileTier.PRO ? 'Pro' : 'OG'
        )
      }
    } catch (error) {
      console.error('Action error:', error)
      throw error
    }
  }

  const handleGift = async (recipient: string) => {
    try {
      console.log('Gifting tier:', {
        recipient,
        targetTier,
      })
      await adminMintTier(
        recipient,
        targetTier === ProfileTier.GROUP ? 'Group' : targetTier === ProfileTier.PRO ? 'Pro' : 'OG'
      )
    } catch (error) {
      console.error('Gift error:', error)
      throw error
    }
  }

  if (!mounted || !authenticated) return null

  if (targetTier === ProfileTier.FREE) {
    return (
      <Button variant='outline' disabled className={className}>
        Current Tier
      </Button>
    )
  }

  const isCurrentTier = currentTier === targetTier
  const isUpgrade = currentTier === ProfileTier.PRO && targetTier === ProfileTier.GROUP

  const buttonText = mintLoading
    ? 'Processing...'
    : isCurrentTier
      ? 'Current Tier'
      : isUpgrade
        ? 'Upgrade to Group ($75)'
        : `Mint ${targetTier === ProfileTier.GROUP ? 'Group ($100)' : targetTier === ProfileTier.PRO ? 'Pro ($25)' : 'OG ($150)'}`

  return (
    <div className={cn('space-y-4', className)}>
      <Button
        onClick={handleAction}
        disabled={isCurrentTier || mintLoading}
        className='w-full gap-2'
      >
        <IconArrowUpRight className='h-4 w-4' />
        {buttonText}
      </Button>

      {showGift && (
        <Button
          variant='outline'
          onClick={() => setIsGiftModalOpen(true)}
          className='w-full gap-2'
          disabled={mintLoading}
        >
          <IconGift className='h-4 w-4' />
          Gift{' '}
          {targetTier === ProfileTier.GROUP
            ? 'Group'
            : targetTier === ProfileTier.PRO
              ? 'Pro'
              : 'OG'}{' '}
          NFT
        </Button>
      )}

      <GiftTierModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        targetTier={targetTier}
        onGiftSuccess={onMintSuccess}
        onGift={handleGift}
      />
    </div>
  )
}
