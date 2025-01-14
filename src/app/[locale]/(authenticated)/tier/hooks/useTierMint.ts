'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useContract } from '@/app/[locale]/(authenticated)/recipe/client/useContract'
import { tierABI } from '@/app/api/blockchain/abis/tier'
import { usdcABI } from '@/app/api/blockchain/abis/usdc'

export type TierType = 'Pro' | 'Group' | 'OG'

export function useTierMint(onSuccess?: () => void) {
  const t = useTranslations('nft')
  const [isLoading, setIsLoading] = useState(false)

  // Initialize contracts using the useContract hook
  const {
    contract: tierContract,
    write: tierWrite,
    read: tierRead,
    address: tierAddress,
  } = useContract('TIER', tierABI)

  const { write: usdcWrite } = useContract('USDC', usdcABI)

  const approveUSDC = async (amount: bigint) => {
    try {
      if (!tierAddress) {
        throw new Error('Tier contract not initialized')
      }

      toast.loading(t('approve.start'))
      await usdcWrite('approve', [tierAddress, amount])
      toast.success(t('approve.success'))
    } catch (error) {
      console.error('USDC approval error:', error)
      toast.error(t('approve.error'))
      throw error
    }
  }

  const getPrice = async (tier: TierType): Promise<bigint> => {
    const priceFunction = `${tier.toLowerCase()}Price`
    return (await tierRead(priceFunction, [])) as bigint
  }

  const mintTier = useCallback(
    async (tier: TierType) => {
      try {
        setIsLoading(true)

        // Get price and approve USDC
        const price = await getPrice(tier)
        await approveUSDC(price)

        // Execute mint transaction
        toast.loading(t('mint.start'))
        const functionName = `mint${tier}`
        await tierWrite(functionName, [])

        toast.success(t('mint.success'))
        onSuccess?.()
      } catch (error) {
        console.error('Error minting tier:', error)
        toast.error(t('mint.error'))
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [tierWrite, tierRead, t, onSuccess]
  )

  const adminMintTier = useCallback(
    async (recipient: string, tier: TierType) => {
      try {
        setIsLoading(true)

        // Execute admin mint transaction
        toast.loading(t('adminMint.start'))
        const functionName = `adminMint${tier}`
        await tierWrite(functionName, [recipient])

        toast.success(t('adminMint.success'))
        onSuccess?.()
      } catch (error) {
        console.error('Error admin minting tier:', error)
        toast.error(t('adminMint.error'))
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [tierWrite, t, onSuccess]
  )

  return {
    isLoading,
    mintTier,
    adminMintTier,
    contract: tierContract,
  }
}
