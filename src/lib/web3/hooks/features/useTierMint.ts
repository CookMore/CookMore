'use client'

import { useState, useCallback } from 'react'
import { useContract } from '../contracts/useContract'
import { TIER_NFT_ABI } from '@/lib/web3/abis'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function useTierMint() {
  const t = useTranslations('nft')
  const [isLoading, setIsLoading] = useState(false)
  const { contract: wagmiContract, write } = useContract('TIER_CONTRACT', TIER_NFT_ABI)

  const mintTier = useCallback(
    async (tier: 'Pro' | 'Group') => {
      try {
        setIsLoading(true)
        toast.loading(t('mint.start'))

        const hash = await write('mint', [tier])
        toast.success(t('mint.success'))
        return hash
      } catch (error) {
        console.error('Error minting tier:', error)
        toast.error(t('mint.error'))
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [write, t]
  )

  return {
    isLoading,
    mintTier,
    contract: wagmiContract,
  }
}
