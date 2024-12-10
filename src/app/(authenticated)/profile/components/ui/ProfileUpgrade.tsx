'use client'

import { Button } from '@/components/ui/button'
import { ProfileTier } from '@/types/profile'
import { useNFTTiers } from '@/lib/web3/hooks/useNFTTiers'
import { useState } from 'react'
import { useWalletClient } from 'wagmi'
import { useContract } from '@/lib/web3/hooks/useContract'
import { TIER_CONTRACT_ADDRESS } from '@/lib/web3/addresses'
import { TIER_CONTRACT_ABI } from '@/lib/web3/abis/TierContracts'
import { toast } from 'sonner'

interface ProfileUpgradeProps {
  currentTier: ProfileTier
}

export function ProfileUpgrade({ currentTier }: ProfileUpgradeProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { refetch } = useNFTTiers()
  const { data: walletClient } = useWalletClient()
  const contract = useContract(TIER_CONTRACT_ADDRESS, TIER_CONTRACT_ABI)

  const handleUpgrade = async () => {
    if (!contract || !walletClient) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      setIsLoading(true)

      // Call the upgrade function
      const tx = await contract.upgradeToGroup()
      await tx.wait()

      await refetch()
      toast.success('Successfully upgraded to Group tier')
    } catch (error) {
      console.error('Error upgrading tier:', error)
      toast.error('Failed to upgrade tier')
    } finally {
      setIsLoading(false)
    }
  }

  if (currentTier === ProfileTier.GROUP) {
    return null
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={isLoading}
      className='mt-4 w-full rounded-md bg-github-accent-emphasis px-4 py-2 text-white hover:bg-github-accent-emphasis/90 disabled:cursor-not-allowed disabled:opacity-50'
    >
      {isLoading ? 'Upgrading...' : 'Upgrade to Group Tier'}
    </button>
  )
}
