'use client'

import { useState } from 'react'
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
} from '@/components/ui/icons'
import { cn } from '@/lib/utils'

// Web3 Imports
import { TIER_CONTRACT_ABI } from '@/lib/web3/abis/TierContracts'
import { TIER_CONTRACT_ADDRESS } from '@/lib/web3/addresses/contracts'
import { SUPPORTED_CHAINS } from '@/lib/web3/config/chains'
import { useWalletState } from '@/lib/web3/features/wallet'
import { useNFTTiers } from '@/lib/web3/features/tier'

// Types and Constants
import { ProfileTier } from '@/app/api/types/profile'
import { tierInfo, tierStyles } from '@/lib/tiers'

interface TierMintDappProps {
  onMintSuccess?: () => void
  currentTier?: ProfileTier
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

export function TierMintDapp({ onMintSuccess, targetTier }: TierMintDappProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isGifting, setIsGifting] = useState(false)
  const [giftAddress, setGiftAddress] = useState('')
  const [mintError, setMintError] = useState<string | null>(null)
  const { address } = useWalletState()
  const { data: walletClient } = useWalletClient()
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const { refetch: refetchTiers } = useNFTTiers()
  const displayName = getTierDisplayName(targetTier)

  // Get tier-specific styles
  const style = tierStyles[targetTier]

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

  const handleMint = async () => {
    setMintError(null)
    setIsLoading(true)

    try {
      if (!address || !walletClient || !publicClient) {
        throw new Error('Please connect your wallet first')
      }

      const balance = await publicClient.getBalance({ address })
      if (balance === BigInt(0)) {
        throw new Error('Insufficient funds for transaction')
      }

      console.log('Starting mint transaction for tier:', targetTier)

      const { request } = await publicClient.simulateContract({
        address: TIER_CONTRACT_ADDRESS,
        abi: TIER_CONTRACT_ABI,
        functionName: targetTier === ProfileTier.PRO ? 'mintPro' : 'mintGroup',
        args: [],
        account: address,
      })

      console.log('Transaction simulation successful')
      const hash = await walletClient.writeContract(request)
      console.log('Transaction hash:', hash)

      toast.info(
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <IconSpinner className='h-4 w-4 animate-spin' />
            <span>Processing transaction...</span>
          </div>
          <a
            href={hash ? `https://basescan.org/tx/${hash}` : '#'}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1 text-sm text-github-accent-fg hover:underline'
          >
            View on BaseScan
            <IconChevronRight className='h-3 w-3' />
          </a>
        </div>
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      console.log('Transaction receipt:', receipt)

      // Parse logs for Minted event
      const mintedEvents = receipt.logs
        .filter((log) => {
          try {
            const event = publicClient.decodeEventLog({
              abi: TIER_CONTRACT_ABI,
              eventName: 'Minted',
              data: log.data,
              topics: log.topics,
            })
            return event !== null
          } catch {
            return false
          }
        })
        .map((log) => {
          const event = publicClient.decodeEventLog({
            abi: TIER_CONTRACT_ABI,
            eventName: 'Minted',
            data: log.data,
            topics: log.topics,
          })
          console.log('Minted event data:', event)
          return event
        })

      if (receipt.status === 'success') {
        console.log('Mint successful, found events:', mintedEvents)
        await refetchTiers()
        onMintSuccess?.()
        toast.success(`Successfully minted ${targetTier} NFT`)
      } else {
        console.error('Transaction failed:', receipt)
        throw new Error('Transaction failed')
      }
    } catch (error) {
      console.error('Mint error:', error)
      setMintError(error instanceof Error ? error.message : 'Failed to mint NFT')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGift = async (recipientAddress: string) => {
    setMintError(null)
    setIsLoading(true)

    try {
      if (!address || !walletClient) {
        throw new Error('Wallet not connected')
      }

      const { request } = await publicClient.simulateContract({
        address: targetTier === ProfileTier.PRO ? PRO_CONTRACT : GROUP_CONTRACT,
        abi: TIER_CONTRACT_ABI,
        functionName: 'giftTier',
        args: [recipientAddress, targetTier === ProfileTier.GROUP],
        account: address,
      })

      const hash = await walletClient.writeContract(request)

      toast.info(
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <IconSpinner className='h-4 w-4 animate-spin' />
            <span>Processing gift transaction...</span>
          </div>
          <a
            href={hash ? `https://basescan.org/tx/${hash}` : '#'}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1 text-sm text-github-accent-fg hover:underline'
          >
            View on BaseScan
            <IconChevronRight className='h-3 w-3' />
          </a>
        </div>
      )

      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      if (receipt.status === 'success') {
        await refetchTiers()
        onMintSuccess?.()
        toast.success(`Successfully gifted ${targetTier} NFT to ${recipientAddress}`)
        setIsGifting(false)
        setGiftAddress('')
      } else {
        throw new Error('Transaction failed')
      }
    } catch (error: any) {
      console.error('Gift error:', error)
      setMintError(error.message || 'Failed to gift NFT')
      toast.error(error.message || 'Failed to gift NFT. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      {mintError && (
        <div className='rounded-md bg-github-danger-subtle p-3'>
          <div className='flex items-center gap-2'>
            <IconAlertTriangle className='h-4 w-4 text-github-danger-fg' />
            <p className='text-sm text-github-danger-fg'>{mintError}</p>
          </div>
        </div>
      )}

      {/* Mint button */}
      <button
        type='button'
        onClick={handleMint}
        disabled={isLoading}
        className={cn(
          'relative w-full overflow-hidden rounded-lg border px-4 py-3 transition-all',
          'flex items-center justify-center gap-2',
          style.borderColor,
          style.bgColor,
          style.color,
          'hover:brightness-95',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        {isLoading ? (
          <>
            <IconSpinner className='h-5 w-5 animate-spin' />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <IconMint className='h-5 w-5' />
            <span className='font-medium'>Mint {displayName} NFT</span>
          </>
        )}
      </button>

      {/* Gift section */}
      <div className='border-t border-github-border-default pt-4'>
        {isGifting ? (
          <div className='space-y-3'>
            <div className='space-y-2'>
              <label htmlFor='giftAddress' className='text-sm font-medium text-github-fg-default'>
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
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
                disabled={isLoading}
              />
            </div>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={() => handleGift(giftAddress)}
                disabled={isLoading || !giftAddress}
                className={cn(
                  'flex-1 rounded-lg px-4 py-2 transition-all',
                  'flex items-center justify-center gap-2',
                  style.borderColor,
                  style.bgColor,
                  style.color,
                  'hover:brightness-95',
                  'disabled:cursor-not-allowed disabled:opacity-50'
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
                    <span>Gift {displayName} NFT</span>
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
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type='button'
            onClick={() => setIsGifting(true)}
            disabled={isLoading}
            className={cn(
              'w-full rounded-lg border border-github-border-default px-4 py-2',
              'flex items-center justify-center gap-2',
              'text-github-fg-default hover:bg-github-canvas-subtle',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            <IconGift className='h-5 w-5' />
            <span>Gift {displayName} NFT</span>
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
