'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useContract } from './useContract'
import { TIER_CONTRACT_ABI } from '../abis'
import { TIER_CONTRACT_ADDRESS } from '../addresses'
import { usePublicClient } from 'wagmi'
import { ProfileTier } from '@/types/profile'

interface TierState {
  isLoading: boolean
  hasGroup: boolean
  hasPro: boolean
  error: Error | null
  currentTier: ProfileTier
}

export function useNFTTiers() {
  const { ready, authenticated, user } = usePrivy()
  const publicClient = usePublicClient()
  const [state, setState] = useState<TierState>({
    isLoading: true,
    hasGroup: false,
    hasPro: false,
    error: null,
    currentTier: ProfileTier.FREE,
  })

  const contract = useContract(TIER_CONTRACT_ADDRESS, TIER_CONTRACT_ABI)

  const checkTierStatus = useCallback(async () => {
    if (!contract || !user?.wallet?.address) {
      setState((prev) => ({ ...prev, isLoading: false }))
      return
    }

    try {
      console.log('Checking tier status for address:', user.wallet.address)
      const balance = await contract.balanceOf(user.wallet.address)
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
      const hasGroup = await contract.isGroupTier(balance)
      console.log('Has Group tier:', hasGroup)

      setState({
        isLoading: false,
        hasGroup: hasGroup,
        hasPro: !hasGroup && balanceNumber > 0, // If they have a token but it's not group, it must be pro
        error: null,
        currentTier: hasGroup
          ? ProfileTier.GROUP
          : balanceNumber > 0
            ? ProfileTier.PRO
            : ProfileTier.FREE,
      })
    } catch (error) {
      console.error('Error checking tier status:', error)
      setState({
        isLoading: false,
        hasGroup: false,
        hasPro: false,
        error: error as Error,
        currentTier: ProfileTier.FREE,
      })
    }
  }, [contract, user?.wallet?.address])

  // Listen for contract events
  useEffect(() => {
    if (!contract || !user?.wallet?.address || !publicClient) return

    try {
      const unwatch = publicClient.watchContractEvent({
        address: TIER_CONTRACT_ADDRESS,
        abi: TIER_CONTRACT_ABI,
        eventName: 'Minted',
        onLogs: (logs) => {
          console.log('Minted event:', logs)
          checkTierStatus() // Refresh state when new token is minted
        },
      })

      return () => {
        unwatch()
      }
    } catch (error) {
      console.error('Error watching contract events:', error)
    }
  }, [contract, user?.wallet?.address, publicClient, checkTierStatus])

  useEffect(() => {
    // Only check tier status when we're ready and authenticated
    if (ready && authenticated) {
      checkTierStatus()
    }
  }, [ready, authenticated, user?.wallet?.address, checkTierStatus])

  return {
    ...state,
    refetch: checkTierStatus,
  }
}
