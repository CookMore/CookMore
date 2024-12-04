'use client'

import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'
import { IconMint, IconGift } from '@/components/ui/icons'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { ProfileTier } from '@/types/profile'
import { cn } from '@/lib/utils'
import { ethers } from 'ethers'
import { usePrivy } from '@privy-io/react-auth'
import { TIER_CONTRACT_ADDRESS } from '@/lib/web3/addresses'
import { TIER_CONTRACT_ABI } from '@/lib/web3/abis/TierContracts'

// USDC Contract on Base Sepolia
const USDC_ADDRESS = '0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897'
const USDC_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
]

interface TierMintDappProps {
  onMintSuccess?: () => void
  currentTier?: ProfileTier
  targetTier: ProfileTier
}

export function TierMintDapp({
  onMintSuccess,
  currentTier = ProfileTier.FREE,
  targetTier,
}: TierMintDappProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isGifting, setIsGifting] = useState(false)
  const [giftAddress, setGiftAddress] = useState('')
  const { user, authenticated, login } = usePrivy()

  const handleMint = async (recipientAddress?: string) => {
    if (!authenticated) {
      login()
      return
    }

    try {
      setIsLoading(true)

      if (!user?.wallet) {
        throw new Error('Wallet not connected')
      }

      const provider = window.ethereum
      if (!provider) {
        throw new Error('No provider available')
      }

      console.log('Initializing contracts...')
      const browserProvider = new ethers.BrowserProvider(provider)
      const signer = await browserProvider.getSigner()
      const userAddress = await signer.getAddress()

      // Create contract instances
      const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer)
      const tierContract = new ethers.Contract(TIER_CONTRACT_ADDRESS, TIER_CONTRACT_ABI, signer)

      console.log('Checking USDC balance...')
      const balance = await usdcContract.balanceOf(userAddress)
      console.log('USDC Balance:', balance.toString())

      // Get price based on tier
      console.log('Getting tier price...')
      const price =
        targetTier === ProfileTier.PRO
          ? await tierContract.proPrice()
          : await tierContract.groupPrice()
      console.log('Price:', price.toString())

      // Check and handle USDC approval
      console.log('Checking USDC allowance...')
      const allowance = await usdcContract.allowance(userAddress, TIER_CONTRACT_ADDRESS)
      console.log('Current allowance:', allowance.toString())

      if (allowance < price) {
        console.log('Approving USDC spend...')
        const approveTx = await usdcContract.approve(TIER_CONTRACT_ADDRESS, price)
        console.log('Waiting for approval confirmation...')
        await approveTx.wait()
        console.log('USDC approved')
      }

      // Now proceed with minting
      console.log('Minting NFT...')
      let tx
      if (recipientAddress) {
        tx = await tierContract.giftTier(recipientAddress, targetTier === ProfileTier.GROUP)
      } else {
        tx =
          targetTier === ProfileTier.PRO
            ? await tierContract.mintPro()
            : await tierContract.mintGroup()
      }

      console.log('Waiting for mint confirmation...')
      await tx.wait()
      console.log('Mint successful')

      toast({
        title: 'Success!',
        description: recipientAddress
          ? `Successfully gifted ${targetTier} NFT to ${recipientAddress}`
          : `Successfully minted ${targetTier} NFT`,
      })

      if (recipientAddress) {
        setGiftAddress('')
        setIsGifting(false)
      }

      onMintSuccess?.()
    } catch (error: any) {
      // Handle user rejection specifically
      if (
        error.code === 'ACTION_REJECTED' ||
        error.code === 4001 || // MetaMask rejection code
        error.message?.includes('user rejected') ||
        error.message?.includes('User denied')
      ) {
        // Log as info instead of error since this is a user action
        console.info('Transaction cancelled by user')
        toast({
          title: 'Transaction Cancelled',
          description: 'You cancelled the transaction',
          variant: 'default',
        })
        return
      }

      // Only log as error for actual errors
      console.error('Error minting token:', error)
      toast({
        title: 'Error',
        description: error?.reason || error?.message || 'Failed to mint token. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGiftToken = () => handleMint(giftAddress)

  if (targetTier === ProfileTier.FREE) return null

  return (
    <div className='space-y-4'>
      <Button
        className='w-full relative'
        onClick={() => handleMint()}
        disabled={isLoading}
        variant={targetTier === ProfileTier.PRO ? 'secondary' : 'default'}
      >
        <span className={cn('flex items-center justify-center gap-2', isLoading && 'opacity-0')}>
          <IconMint className='w-5 h-5' />
          Mint {targetTier} NFT
        </span>
        {isLoading && <LoadingSpinner className='absolute inset-0 m-auto' />}
      </Button>

      <div className='border-t border-github-border-default' />

      {isGifting ? (
        <div className='space-y-3'>
          <input
            type='text'
            placeholder='Enter recipient address'
            value={giftAddress}
            onChange={(e) => setGiftAddress(e.target.value)}
            className='w-full px-3 py-2 rounded-md border bg-background text-sm'
          />
          <div className='flex gap-2'>
            <Button
              className='flex-1 relative'
              onClick={handleGiftToken}
              disabled={isLoading || !giftAddress}
              variant={targetTier === ProfileTier.PRO ? 'secondary' : 'default'}
            >
              <span
                className={cn('flex items-center justify-center gap-2', isLoading && 'opacity-0')}
              >
                <IconGift className='w-5 h-5' />
                Gift NFT
              </span>
              {isLoading && <LoadingSpinner className='absolute inset-0 m-auto' />}
            </Button>
            <Button variant='outline' onClick={() => setIsGifting(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button className='w-full' variant='outline' onClick={() => setIsGifting(true)}>
          <span className='flex items-center justify-center gap-2'>
            <IconGift className='w-5 h-5' />
            Gift NFT
          </span>
        </Button>
      )}
    </div>
  )
}
