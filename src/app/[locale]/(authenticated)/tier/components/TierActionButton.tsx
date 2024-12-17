'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/app/api/utils/utils'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { TierActionButtonProps } from '../types/tier-actions'
import { Button } from '@/app/api/components/ui/button'
import { IconGift, IconArrowUpRight } from '@tabler/icons-react'
import { GiftTierModal } from './GiftTierModal'
import { usePrivy } from '@privy-io/react-auth'
import { useContractWrite, useWaitForTransactionReceipt } from 'wagmi'
import { TIER_CONTRACT_ABI, TIER_CONTRACT_ADDRESS } from '@/app/api/web3/abis/TierContracts'

export function TierActionButton({
  currentTier,
  targetTier,
  onMintSuccess,
  className,
}: TierActionButtonProps) {
  const [mounted, setMounted] = useState(false)
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false)
  const { authenticated } = usePrivy()

  useEffect(() => {
    setMounted(true)
  }, [])

  const { write: mintTier, data: mintData } = useContractWrite({
    address: TIER_CONTRACT_ADDRESS,
    abi: TIER_CONTRACT_ABI,
    functionName: targetTier === ProfileTier.GROUP ? 'mintGroup' : 'mintPro',
  })

  const { write: upgradeTier, data: upgradeData } = useContractWrite({
    address: TIER_CONTRACT_ADDRESS,
    abi: TIER_CONTRACT_ABI,
    functionName: 'mintGroup', // When upgrading, always to Group
  })

  const { isLoading: isMinting } = useWaitForTransactionReceipt({
    hash: mintData?.hash,
    onSuccess: () => onMintSuccess?.(),
  })

  const { isLoading: isUpgrading } = useWaitForTransactionReceipt({
    hash: upgradeData?.hash,
    onSuccess: () => onMintSuccess?.(),
  })

  const handleAction = async () => {
    if (currentTier === ProfileTier.PRO && targetTier === ProfileTier.GROUP) {
      await upgradeTier?.()
    } else {
      await mintTier?.()
    }
  }

  if (!mounted || !authenticated) {
    return null
  }

  if (targetTier === ProfileTier.FREE) {
    return (
      <Button variant='outline' disabled className={className}>
        Current Tier
      </Button>
    )
  }

  const isCurrentTier = currentTier === targetTier
  const isUpgrade = currentTier === ProfileTier.PRO && targetTier === ProfileTier.GROUP
  const isLoading = isMinting || isUpgrading

  return (
    <div className={cn('space-y-4', className)}>
      <Button onClick={handleAction} disabled={isCurrentTier || isLoading} className='w-full gap-2'>
        <IconArrowUpRight className='h-4 w-4' />
        {isLoading
          ? 'Processing...'
          : isCurrentTier
            ? 'Current Tier'
            : isUpgrade
              ? 'Upgrade to Group'
              : `Mint ${targetTier} NFT`}
      </Button>

      {!isCurrentTier && (
        <Button
          variant='outline'
          onClick={() => setIsGiftModalOpen(true)}
          className='w-full gap-2'
          disabled={isLoading}
        >
          <IconGift className='h-4 w-4' />
          Gift {targetTier} NFT
        </Button>
      )}

      <GiftTierModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        targetTier={targetTier}
        onGiftSuccess={onMintSuccess}
      />
    </div>
  )
}
