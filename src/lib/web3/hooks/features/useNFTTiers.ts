'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useContract } from '../contracts/useContract'
import { TIER_CONTRACT_ABI } from '@/lib/web3/abis'
import { usePublicClient } from 'wagmi'
import { ProfileTier } from '@/types/profile'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

interface TierState {
  isLoading: boolean
  hasGroup: boolean
  hasPro: boolean
  error: Error | null
  currentTier: ProfileTier
}

export function useNFTTiers() {
  const t = useTranslations('nft')
  const { ready, authenticated, user } = usePrivy()
  const publicClient = usePublicClient()
  const [state, setState] = useState<TierState>({
    isLoading: true,
    hasGroup: false,
    hasPro: false,
    error: null,
    currentTier: ProfileTier.FREE,
  })

  const { contract: wagmiContract } = useContract('TIER_CONTRACT', TIER_CONTRACT_ABI)

  const checkTierStatus = useCallback(async () => {
    if (!user?.wallet?.address) {
      setState((prev) => ({ ...prev, isLoading: false }))
      return
    }

    try {
      console.log('Checking tier status for address:', user.wallet.address)
      toast.loading(t('tiers.check'))
      
      const balance = await wagmiContract.balanceOf(user.wallet.address)
      console.log('NFT balance:', balance.toString())
      const balanceNumber = Number(balance)

      if (balanceNumber === 0) {
        setState({
          isLoading: false,
          hasGroup: false,
          hasPro: false,
          error: null,
          currentTier: ProfileTier.FREE,
        })
        return
      }

      // Check if the user has a group tier token
      const hasGroup = await wagmiContract.isGroupTier(balance)
      console.log('Has Group tier:', hasGroup)

      setState({
        isLoading: false,
        hasGroup: hasGroup,
        hasPro: !hasGroup && balanceNumber > 0,
        error: null,
        currentTier: hasGroup
          ? ProfileTier.GROUP
          : balanceNumber > 0
            ? ProfileTier.PRO
            : ProfileTier.FREE,
      })
      
      toast.success(t('tiers.update'))
    } catch (error) {
      console.error('Error checking tier status:', error)
      setState({
        isLoading: false,
        hasGroup: false,
        hasPro: false,
        error: error as Error,
        currentTier: ProfileTier.FREE,
      })
      toast.error(t('tiers.error'))
    }
  }, [wagmiContract, user?.wallet?.address, t])

  // Listen for contract events
  useEffect(() => {
    if (!user?.wallet?.address || !publicClient) return

    try {
      const unwatch = publicClient.watchContractEvent({
        address: wagmiContract.address as `0x${string}`,
        abi: TIER_CONTRACT_ABI,
        eventName: 'Minted',
        onLogs: (logs) => {
          console.log('Minted event:', logs)
          checkTierStatus()
        },
      })

      return () => {
        unwatch()
      }
    } catch (error) {
      console.error('Error watching contract events:', error)
    }
  }, [wagmiContract, user?.wallet?.address, publicClient, checkTierStatus])

  useEffect(() => {
    if (ready && authenticated) {
      checkTierStatus()
    }
  }, [ready, authenticated, checkTierStatus])

  return {
    ...state,
    refetch: checkTierStatus,
  }
}
