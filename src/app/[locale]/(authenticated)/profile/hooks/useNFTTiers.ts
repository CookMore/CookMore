'use client'

import { useState, useEffect } from 'react'
import { useAccount, useContractRead, useContractEvent } from 'wagmi'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { tierABI } from '@/app/api/blockchain/abis/tier'
import { TIER_CONTRACT_ADDRESS } from '@/app/api/tiers/tiers'
import { getContract } from 'viem'

// Define the minimal ERC721 functions we need
const minimalERC721ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const

// Combine ABIs for the tier contract
const combinedABI = [...tierABI, ...minimalERC721ABI] as const

export function useNFTTiers() {
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [tierState, setTierState] = useState({
    hasGroup: false,
    hasPro: false,
    hasOG: false,
    currentTier: ProfileTier.FREE,
    isLoading: true,
  })

  // Check if contract address is set
  const isContractConfigured =
    TIER_CONTRACT_ADDRESS !== '0x1234567890123456789012345678901234567890'

  // Get balance of user
  const { data: balance, refetch: refetchBalance } = useContractRead({
    address: TIER_CONTRACT_ADDRESS,
    abi: combinedABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    enabled: mounted && isConnected && !!address && isContractConfigured,
  })

  // Effect to check tier type
  useEffect(() => {
    if (!mounted || !isConnected || !address || !isContractConfigured || !balance) {
      setTierState((prev) => ({ ...prev, isLoading: false }))
      return
    }

    const checkTiers = async () => {
      try {
        setTierState((prev) => ({ ...prev, isLoading: true }))

        const contract = getContract({
          address: TIER_CONTRACT_ADDRESS,
          abi: combinedABI,
        })

        // Get all Transfer events to this address
        const filter = await contract.createEventFilter.Transfer(null, address, {
          fromBlock: 'earliest',
        })
        const events = await contract.getFilterLogs({ filter })

        let hasGroup = false
        let hasPro = false
        let hasOG = false
        let currentTier = ProfileTier.FREE

        // Check the tier type for each token
        for (const event of events) {
          const tokenId = event.args.tokenId
          const tierType = await contract.read.tokenTier([tokenId])

          if (tierType === 'Group') {
            hasGroup = true
            currentTier = ProfileTier.GROUP
          } else if (tierType === 'Pro') {
            hasPro = true
            currentTier = ProfileTier.PRO
          } else if (tierType === 'OG') {
            hasOG = true
            currentTier = ProfileTier.OG
          }
        }

        setTierState({
          hasGroup,
          hasPro,
          hasOG,
          currentTier,
          isLoading: false,
        })
      } catch (error) {
        console.error('Error checking tiers:', error)
        setTierState({
          hasGroup: false,
          hasPro: false,
          hasOG: false,
          currentTier: ProfileTier.FREE,
          isLoading: false,
        })
      }
    }

    checkTiers()
  }, [mounted, address, isConnected, balance, isContractConfigured])

  // Subscribe to Transfer events
  useContractEvent({
    address: TIER_CONTRACT_ADDRESS,
    abi: combinedABI,
    eventName: 'Transfer',
    listener(log) {
      // Refetch balance when a transfer occurs to/from the user's address
      if (log.args.from === address || log.args.to === address) {
        refetchBalance()
      }
    },
  })

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  const refetch = async () => {
    if (!mounted || !isConnected || !address || !isContractConfigured) return

    try {
      await refetchBalance()
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
