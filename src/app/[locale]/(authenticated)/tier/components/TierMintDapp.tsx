'use client'

import { useState, useEffect } from 'react'
import { useWalletClient, useChainId, usePublicClient } from 'wagmi'
import { toast } from 'sonner'

// UI Components
import {
  IconMint,
  IconGift,
  IconWallet,
  IconAlertTriangle,
  IconChevronRight,
  IconSpinner,
  IconLock,
} from '@/app/api/icons'
import { cn } from '@/app/api/utils/utils'

// Web3 Imports
import { TIER_CONTRACT_ABI } from '@/app/api/web3/abis/TierContracts'
import { TIER_CONTRACT_ADDRESS } from '@/app/api/web3/addresses/contracts'
import { SUPPORTED_CHAINS } from '@/app/api/web3/config/chains'
import { useWalletState } from '@/app/api/web3/hooks/wallet/useWalletState'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { useTierMint, TierType } from '@/app/[locale]/(authenticated)/tier/hooks/useTierMint'

// Types and Constants
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { tierInfo, tierStyles } from '@/app/api/tiers/tiers'
import { inter } from '@/app/api/fonts'

interface TierMintDappProps {
  onMintSuccess?: () => void
  currentTier?: ProfileTier | null
  targetTier: ProfileTier
}

const getTierDisplayName = (tier: ProfileTier) => {
  switch (tier) {
    case ProfileTier.FREE:
      return 'Lite'
    case ProfileTier.PRO:
      return 'Pro'
    case ProfileTier.GROUP:
      return 'Group'
    default:
      return tier
  }
}

export function TierMintDapp({ onMintSuccess, currentTier, targetTier }: TierMintDappProps) {
  const [isGifting, setIsGifting] = useState(false)
  const [giftAddress, setGiftAddress] = useState('')
  const [mintError, setMintError] = useState<string | null>(null)
  const { address } = useWalletState()
  const chainId = useChainId()
  const { hasGroup, hasPro, isLoading: tiersLoading } = useNFTTiers()
  const { isLoading, mintTier, contract } = useTierMint(onMintSuccess)

  // Network check
  const isCorrectChain =
    chainId === SUPPORTED_CHAINS.BASE_MAINNET || chainId === SUPPORTED_CHAINS.BASE_SEPOLIA

  if (!isCorrectChain) {
    return (
      <div className='rounded-lg border border-github-danger-emphasis bg-github-danger-subtle p-4'>
        <div className='flex items-center gap-3'>
          <IconAlertTriangle className='h-5 w-5 text-github-danger-fg' />
          <div className='flex-1'>
            <h3 className='text-sm font-medium text-github-danger-fg'>Wrong Network</h3>
            <p className='mt-1 text-sm text-github-danger-fg/70'>
              Please switch to Base Mainnet or Base Sepolia network
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!address) {
    return (
      <div className='rounded-lg border border-github-border-default bg-github-canvas-subtle p-4'>
        <div className='flex items-center gap-3'>
          <IconWallet className='h-5 w-5 text-github-fg-muted' />
          <div className='flex-1'>
            <h3 className='text-sm font-medium text-github-fg-default'>Wallet Required</h3>
            <p className='mt-1 text-sm text-github-fg-muted'>
              Please connect your wallet to mint or gift NFTs
            </p>
          </div>
        </div>
      </div>
    )
  }

  const handleMint = async (tier: ProfileTier) => {
    setMintError(null)
    try {
      if (!address) {
        throw new Error('Please connect your wallet first')
      }

      const tierType: TierType = tier === ProfileTier.PRO ? 'Pro' : 'Group'
      await mintTier(tierType)
    } catch (error) {
      console.error('Mint error:', error)
      setMintError(error instanceof Error ? error.message : 'Failed to mint NFT')
    }
  }

  const handleGift = async (recipientAddress: string, tier: ProfileTier) => {
    setMintError(null)
    try {
      if (!address || !contract) {
        throw new Error('Wallet not connected')
      }

      const tierType: TierType = tier === ProfileTier.PRO ? 'Pro' : 'Group'
      await contract.write.giftTier([recipientAddress, tierType === 'Group'])

      toast.success(`Successfully gifted ${getTierDisplayName(tier)} NFT to ${recipientAddress}`)
      setIsGifting(false)
      setGiftAddress('')
      onMintSuccess?.()
    } catch (error: any) {
      console.error('Gift error:', error)
      setMintError(error.message || 'Failed to gift NFT')
      toast.error(error.message || 'Failed to gift NFT. Please try again.')
    }
  }

  const handleUpgrade = async () => {
    setMintError(null)
    try {
      if (!address || !contract) {
        throw new Error('Wallet not connected')
      }

      // Get the token ID of the Pro NFT to upgrade
      const balance = await contract.read.balanceOf([address])
      if (balance === BigInt(0)) {
        throw new Error('No Pro NFT found to upgrade')
      }

      const tokenId = await contract.read.tokenOfOwnerByIndex([address, BigInt(0)])
      await contract.write.upgradeToGroup([tokenId])

      toast.success('Successfully upgraded to Group tier')
      onMintSuccess?.()
    } catch (error: any) {
      console.error('Upgrade error:', error)
      setMintError(error.message || 'Failed to upgrade NFT')
      toast.error(error.message || 'Failed to upgrade NFT. Please try again.')
    }
  }

  const renderMintButton = (tier: ProfileTier) => {
    const style = tierStyles[tier]
    const displayName = getTierDisplayName(tier)
    const showLock = !hasPro && tier === ProfileTier.GROUP
    const alreadyOwned =
      (tier === ProfileTier.PRO && hasPro) || (tier === ProfileTier.GROUP && hasGroup)
    const canUpgrade = tier === ProfileTier.GROUP && hasPro && !hasGroup

    const buttonAction = canUpgrade ? handleUpgrade : () => handleMint(tier)
    const buttonText = canUpgrade ? 'Upgrade to Group' : alreadyOwned ? 'Mint Another' : 'Mint Now'
    const buttonIcon = canUpgrade ? (
      <IconChevronRight className='h-5 w-5' />
    ) : showLock ? (
      <IconLock className='h-5 w-5' />
    ) : (
      <IconMint className='h-5 w-5' />
    )

    return (
      <div className='space-y-2'>
        <div className={cn('rounded-lg border p-4', 'bg-github-canvas-subtle', style.borderColor)}>
          <div className='flex items-center justify-between mb-3'>
            <h3 className={cn('text-lg font-semibold', inter.className, style.color)}>
              {displayName} NFT
            </h3>
            {alreadyOwned && (
              <span className='text-sm text-github-success-fg bg-github-success-subtle px-2 py-1 rounded'>
                Owned
              </span>
            )}
          </div>
          <button
            type='button'
            onClick={buttonAction}
            disabled={isLoading || (showLock && !hasPro)}
            className={cn(
              'w-full overflow-hidden rounded-lg border px-4 py-3 transition-all',
              'flex items-center justify-center gap-2',
              style.borderColor,
              style.bgColor,
              style.color,
              'hover:brightness-95 hover:shadow-sm',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'font-medium'
            )}
          >
            {isLoading ? (
              <>
                <IconSpinner className='h-5 w-5 animate-spin' />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {buttonIcon}
                <span className={cn('font-medium', inter.className)}>
                  {buttonText}
                  {showLock && ' (Requires Pro)'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {mintError && (
        <div className='rounded-md bg-github-danger-subtle p-4 border border-github-danger-emphasis'>
          <div className='flex items-center gap-2'>
            <IconAlertTriangle className='h-5 w-5 text-github-danger-fg' />
            <p className={cn('text-sm text-github-danger-fg', inter.className)}>{mintError}</p>
          </div>
        </div>
      )}

      {/* Mint buttons - always show both */}
      <div className='space-y-4'>
        {tiersLoading ? (
          <div className='space-y-4'>
            {[1, 2].map((i) => (
              <div key={i} className='animate-pulse'>
                <div className='rounded-lg border border-github-border-default p-4 bg-github-canvas-subtle'>
                  <div className='h-6 w-24 bg-github-border-default rounded mb-3'></div>
                  <div className='h-12 bg-github-border-default rounded'></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {renderMintButton(ProfileTier.PRO)}
            {renderMintButton(ProfileTier.GROUP)}
          </>
        )}
      </div>

      {/* Gift section - always visible */}
      <div className='border-t border-github-border-default pt-6'>
        {isGifting ? (
          <div className='rounded-lg border border-github-border-default p-4 bg-github-canvas-subtle'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label
                  htmlFor='giftAddress'
                  className={cn('text-sm font-medium text-github-fg-default', inter.className)}
                >
                  Recipient Address
                </label>
                <input
                  id='giftAddress'
                  type='text'
                  placeholder='0x...'
                  value={giftAddress}
                  onChange={(e) => setGiftAddress(e.target.value)}
                  className={cn(
                    'w-full rounded-md border bg-github-canvas-default px-3 py-2',
                    'border-github-border-default focus:border-github-accent-emphasis',
                    'text-github-fg-default placeholder:text-github-fg-subtle',
                    'focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis focus:ring-opacity-25',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    inter.className
                  )}
                  disabled={isLoading}
                />
              </div>
              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={() => handleGift(giftAddress, targetTier)}
                  disabled={isLoading || !giftAddress}
                  className={cn(
                    'flex-1 rounded-lg px-4 py-2 transition-all',
                    'flex items-center justify-center gap-2',
                    tierStyles[targetTier].borderColor,
                    tierStyles[targetTier].bgColor,
                    tierStyles[targetTier].color,
                    'hover:brightness-95 hover:shadow-sm',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    inter.className
                  )}
                >
                  {isLoading ? (
                    <>
                      <IconSpinner className='h-5 w-5 animate-spin' />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <IconGift className='h-5 w-5' />
                      <span>Gift {getTierDisplayName(targetTier)} NFT</span>
                    </>
                  )}
                </button>
                <button
                  type='button'
                  onClick={() => setIsGifting(false)}
                  disabled={isLoading}
                  className={cn(
                    'rounded-lg border border-github-border-default px-4 py-2',
                    'text-github-fg-default hover:bg-github-canvas-subtle',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'hover:shadow-sm',
                    inter.className
                  )}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type='button'
            onClick={() => setIsGifting(true)}
            disabled={isLoading}
            className={cn(
              'w-full rounded-lg border border-github-border-default px-4 py-3',
              'flex items-center justify-center gap-2',
              'text-github-fg-default bg-github-canvas-subtle',
              'hover:bg-github-canvas-default hover:shadow-sm',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all',
              inter.className
            )}
          >
            <IconGift className='h-5 w-5' />
            <span>Gift {getTierDisplayName(targetTier)} NFT</span>
          </button>
        )}
      </div>
    </div>
  )
}

// Helper function
function getNetworkName(id: number) {
  switch (id) {
    case SUPPORTED_CHAINS.BASE_MAINNET:
      return 'Base Mainnet'
    case SUPPORTED_CHAINS.BASE_SEPOLIA:
      return 'Base Sepolia'
    default:
      return `Unknown (${id})`
  }
}
