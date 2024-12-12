'use client'

import { useState, useCallback } from 'react'
import { useContract } from '../contracts/useContract'
import { TIER_NFT_ABI } from '@/lib/web3/abis'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { parseEther } from 'viem'

export type TierType = 'Pro' | 'Group'

export function useTierMint(onSuccess?: () => void) {
  const t = useTranslations('nft')
  const [isLoading, setIsLoading] = useState(false)
  const { contract, write, read } = useContract('TIER_CONTRACT', TIER_NFT_ABI)

  const mintTier = useCallback(
    async (tier: TierType) => {
      try {
        setIsLoading(true)
        toast.loading(t('mint.start'))

        const functionName = tier === 'Pro' ? 'mintPro' : 'mintGroup'

        // Get mint price
        const priceFunction = tier === 'Pro' ? 'proPrice' : 'groupPrice'
        const price = await read(priceFunction, [])

        // Execute mint transaction
        const hash = await write(functionName, [], {
          value: price,
        })

        toast.success(t('mint.success'))
        onSuccess?.()
        return hash
      } catch (error) {
        console.error('Error minting tier:', error)
        toast.error(t('mint.error'))
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [write, read, t, onSuccess]
  )

  return {
    isLoading,
    mintTier,
    contract,
  }
}
