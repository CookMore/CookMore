'use client'

import { useState, useEffect } from 'react'
import { Contract, BrowserProvider } from 'ethers'
import { usePrivy } from '@privy-io/react-auth'
import { ProfileTier } from '@/types/profile'
import { PRO_NFT_ADDRESS, GROUP_NFT_ADDRESS } from '@/lib/web3/addresses'

// Simplified ABI for balance checking
const NFT_ABI = ['function balanceOf(address owner) view returns (uint256)']

interface NFTTierState {
  hasPro: boolean
  hasGroup: boolean
  isLoading: boolean
  error: string | null
  currentTier: ProfileTier
}

export function useNFTTiers() {
  const { user, ready } = usePrivy()
  const [mounted, setMounted] = useState(false)
  const [state, setState] = useState<NFTTierState>({
    hasPro: false,
    hasGroup: false,
    isLoading: true,
    error: null,
    currentTier: ProfileTier.FREE,
  })

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check NFT balances
  useEffect(() => {
    if (!mounted || !ready || !user?.wallet?.address || typeof window === 'undefined') {
      setState((prev) => ({ ...prev, isLoading: false }))
      return
    }

    const checkBalances = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }))

        // Get NFT balances
        const provider = window.ethereum
        if (!provider) {
          throw new Error('No provider available')
        }

        const browserProvider = new BrowserProvider(provider)
        const proContract = new Contract(PRO_NFT_ADDRESS, NFT_ABI, browserProvider)
        const groupContract = new Contract(GROUP_NFT_ADDRESS, NFT_ABI, browserProvider)

        // Check balances
        const [proBalance, groupBalance] = await Promise.all([
          proContract.balanceOf(user.wallet.address),
          groupContract.balanceOf(user.wallet.address),
        ])

        const hasPro = Number(proBalance) > 0
        const hasGroup = Number(groupBalance) > 0

        // Determine current tier
        let currentTier = ProfileTier.FREE
        if (hasGroup) currentTier = ProfileTier.GROUP
        else if (hasPro) currentTier = ProfileTier.PRO

        setState({
          hasPro,
          hasGroup,
          isLoading: false,
          error: null,
          currentTier,
        })
      } catch (error) {
        console.error('Error checking NFT balances:', error)
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Failed to check NFT balances',
        }))
      }
    }

    checkBalances()
  }, [mounted, ready, user?.wallet?.address])

  return {
    ...state,
    isHydrated: mounted,
  }
}
