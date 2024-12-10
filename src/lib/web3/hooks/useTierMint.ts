'use client'

import { useState, useCallback } from 'react'
import { useContract } from './useContract'
import { TIER_NFT_ABI } from '@/lib/web3/abis'
import { TIER_CONTRACT_ADDRESS } from '@/lib/web3/addresses'
import { toast } from 'sonner'

export function useTierMint() {
  const [isLoading, setIsLoading] = useState(false)
  const contract = useContract(TIER_CONTRACT_ADDRESS, TIER_NFT_ABI)

  const mintTier = useCallback(
    async (tier: 'Pro' | 'Group') => {
      if (!contract) return

      try {
        setIsLoading(true)
        const tx = await contract.mint(tier)
        await tx.wait()

        toast.success(`Successfully minted ${tier} tier NFT`)
      } catch (error) {
        console.error('Error minting tier:', error)
        toast.error('Failed to mint tier NFT')
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [contract]
  )

  return {
    isLoading,
    mintTier,
  }
}
