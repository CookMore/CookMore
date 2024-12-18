'use client'

import { useState, useEffect } from 'react'
import { useAccount, useContractRead, useContractReads } from 'wagmi'
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
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'index', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
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

  // Use wagmi's useContractReads for batch reading
  const { data: contractData, refetch: refetchContract } = useContractReads({
    contracts: [
      {
        address: TIER_CONTRACT_ADDRESS,
        abi: combinedABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
      {
        address: TIER_CONTRACT_ADDRESS,
        abi: combinedABI,
        functionName: 'tokenOfOwnerByIndex',
        args: [address as `0x${string}`, 0n],
      },
    ],
    enabled: mounted && isConnected && !!address && isContractConfigured,
  })

  // Get tier type for token ID
  const { data: tierType, refetch: refetchTier } = useContractRead({
    address: TIER_CONTRACT_ADDRESS,
    abi: combinedABI,
    functionName: 'tokenTier',
    args: contractData?.[1].result ? [contractData[1].result] : undefined,
    enabled:
      mounted && isConnected && !!address && isContractConfigured && !!contractData?.[1].result,
  })

  // Effect to update tier state based on contract data
  useEffect(() => {
    if (!mounted || !isConnected || !address || !isContractConfigured) {
      setTierState((prev) => ({ ...prev, isLoading: false }))
      return
    }

    const balance = contractData?.[0].result
    const type = tierType as string | undefined

    if (balance && balance > 0n && type) {
      setTierState({
        hasGroup: type === 'Group',
        hasPro: type === 'Pro',
        hasOG: type === 'OG',
        currentTier:
          type === 'Group'
            ? ProfileTier.GROUP
            : type === 'Pro'
              ? ProfileTier.PRO
              : type === 'OG'
                ? ProfileTier.OG
                : ProfileTier.FREE,
        isLoading: false,
      })
    } else {
      setTierState({
        hasGroup: false,
        hasPro: false,
        hasOG: false,
        currentTier: ProfileTier.FREE,
        isLoading: false,
      })
    }
  }, [mounted, address, isConnected, contractData, tierType, isContractConfigured])

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  const refetch = async () => {
    if (!mounted || !isConnected || !address || !isContractConfigured) return
    setTierState((prev) => ({ ...prev, isLoading: true }))

    try {
      await Promise.all([refetchContract(), refetchTier()])
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
