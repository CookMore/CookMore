'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { profileService } from '@/app/[locale]/(authenticated)/profile/services/profile.service'

export function useNFTTiers() {
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [tierState, setTierState] = useState({
    hasGroup: false,
    hasPro: false,
    currentTier: ProfileTier.FREE,
    isLoading: true,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function fetchTierStatus() {
      if (!mounted || !isConnected || !address) {
        return
      }

      try {
        setTierState((prev) => ({ ...prev, isLoading: true }))
        const response = await profileService.getProfile(address)

        if (isMounted && response.success) {
          setTierState({
            hasGroup: response.tierStatus.hasGroup,
            hasPro: response.tierStatus.hasPro,
            currentTier: response.tierStatus.currentTier,
            isLoading: false,
          })
        }
      } catch (error) {
        console.error('Error fetching tier status:', error)
        if (isMounted) {
          setTierState({
            hasGroup: false,
            hasPro: false,
            currentTier: ProfileTier.FREE,
            isLoading: false,
          })
        }
      }
    }

    fetchTierStatus()

    return () => {
      isMounted = false
    }
  }, [mounted, address, isConnected])

  // Log state for debugging
  useEffect(() => {
    if (mounted) {
      console.log('NFT Tiers State:', {
        address,
        isConnected,
        ...tierState,
      })
    }
  }, [mounted, address, isConnected, tierState])

  return tierState
}
