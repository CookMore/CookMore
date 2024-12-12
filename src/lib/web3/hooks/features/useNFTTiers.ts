'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useContract } from '../contracts/useContract'
import { TIER_CONTRACT_ABI } from '@/lib/web3/abis'
import { usePrivy } from '@privy-io/react-auth'
import { usePublicClient } from 'wagmi'
import { ProfileTier } from '@/types/profile'
import { useTranslations } from 'next-intl'

export function useNFTTiers() {
  const t = useTranslations('nft')
  const { ready, authenticated, user } = usePrivy()
  const publicClient = usePublicClient()
  const { contract: wagmiContract, read } = useContract(
    'TIER_CONTRACT',
    TIER_CONTRACT_ABI as unknown as any[]
  )

  const [tierStatus, setTierStatus] = useState({
    hasGroup: false,
    hasPro: false,
    currentTier: ProfileTier.FREE,
  })
  const [isLoading, setIsLoading] = useState(true)

  const checkTierStatus = useCallback(async () => {
    if (!user?.wallet?.address || !wagmiContract) {
      console.log('No wallet or contract:', {
        wallet: user?.wallet?.address,
        contract: !!wagmiContract,
      })
      return {
        hasGroup: false,
        hasPro: false,
        currentTier: ProfileTier.FREE,
      }
    }

    try {
      console.log('Checking tier status for:', user.wallet.address)
      const balance = await read('balanceOf', [user.wallet.address])
      console.log('NFT balance:', balance.toString())

      if (balance === 0n) {
        return {
          hasGroup: false,
          hasPro: false,
          currentTier: ProfileTier.FREE,
        }
      }

      const hasGroup = await read('isGroupTier', [balance])
      console.log('Has Group tier:', hasGroup)

      return {
        hasGroup,
        hasPro: !hasGroup && balance > 0n,
        currentTier: hasGroup
          ? ProfileTier.GROUP
          : balance > 0n
            ? ProfileTier.PRO
            : ProfileTier.FREE,
      }
    } catch (error) {
      console.error('Error checking tier status:', error)
      toast.error(t('tiers.error'))
      return {
        hasGroup: false,
        hasPro: false,
        currentTier: ProfileTier.FREE,
      }
    }
  }, [wagmiContract, read, user?.wallet?.address, t])

  useEffect(() => {
    const updateTierStatus = async () => {
      if (!ready || !authenticated) {
        setIsLoading(true)
        return
      }

      setIsLoading(true)
      const status = await checkTierStatus()
      setTierStatus(status)
      setIsLoading(false)
    }

    updateTierStatus()
  }, [ready, authenticated, checkTierStatus])

  return {
    ...tierStatus,
    isLoading: !ready || !authenticated || isLoading,
    refetch: async () => {
      setIsLoading(true)
      const status = await checkTierStatus()
      setTierStatus(status)
      setIsLoading(false)
    },
  }
}
