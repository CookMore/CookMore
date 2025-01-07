'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { TIER_CONTRACT_ADDRESS } from '@/app/api/tiers/tiers'
import { usePrivy } from '@privy-io/react-auth'

export function useNFTTiers() {
  const { address, isConnected } = useAccount()
  const { user } = usePrivy()
  const [tierState, setTierState] = useState({
    hasGroup: false,
    hasPro: false,
    hasOG: false,
    currentTier: ProfileTier.FREE,
    isLoading: true,
  })

  // Check if contract address is set
  const isContractConfigured =
    TIER_CONTRACT_ADDRESS !== '0x947b40801581E896C29dD73f9C7f5dd710877b64'

  // Function to check API tier status
  const checkApiTierStatus = async () => {
    if (!user?.wallet?.address) {
      setTierState((prev) => ({ ...prev, isLoading: false }))
      return
    }

    try {
      const timestamp = Date.now()
      const response = await fetch(`/api/profile/address/${user.wallet.address}?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      })

      if (!response.ok) {
        console.error('API tier check failed:', response.status)
        return
      }

      const data = await response.json()
      const tierStatus = data.tierStatus

      if (tierStatus) {
        setTierState({
          hasGroup: tierStatus.hasGroup,
          hasPro: tierStatus.hasPro,
          hasOG: tierStatus.hasOG,
          currentTier: tierStatus.currentTier || ProfileTier.FREE,
          isLoading: false,
        })
      }
    } catch (error) {
      console.error('Error checking API tier status:', error)
    }
  }

  // Effect to check API tier status
  useEffect(() => {
    checkApiTierStatus()
  }, [user?.wallet?.address])

  const refetch = async () => {
    if (!isConnected || !address || !isContractConfigured) return
    setTierState((prev) => ({ ...prev, isLoading: true }))

    try {
      await checkApiTierStatus()
    } catch (error) {
      console.error('Error refetching tier status:', error)
      setTierState({
        hasGroup: false,
        hasPro: false,
        hasOG: false,
        currentTier: ProfileTier.FREE,
        isLoading: false,
      })
    }
  }

  return {
    ...tierState,
    refetch,
    isContractConfigured,
  }
}
