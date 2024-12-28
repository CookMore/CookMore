'use client'

import { useState, useEffect } from 'react'
import { useAccount, useContractRead, useContractReads } from 'wagmi'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { tierABI } from '@/app/api/blockchain/abis/tier'
import { TIER_CONTRACT_ADDRESS } from '@/app/api/tiers/tiers'
import { getContract } from 'viem'
import { serializeBigInt } from '@/app/api/blockchain/utils'
import { usePrivy } from '@privy-io/react-auth'

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
  const { user } = usePrivy()
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
    TIER_CONTRACT_ADDRESS !== '0x947b40801581E896C29dD73f9C7f5dd710877b64'

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

  // Effect to check API tier status
  useEffect(() => {
    const checkApiTierStatus = async () => {
      if (!mounted || !user?.wallet?.address) {
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

    checkApiTierStatus()
  }, [mounted, user?.wallet?.address])

  // Effect to update tier state based on contract data
  useEffect(() => {
    if (!mounted || !isConnected || !address || !isContractConfigured) {
      return
    }

    const balance = contractData?.[0].result
    const type = tierType as string | undefined

    if (balance && balance > 0n && type) {
      setTierState((prev) => ({
        ...prev,
        hasGroup: type === 'Group' || prev.hasGroup,
        hasPro: type === 'Pro' || prev.hasPro,
        hasOG: type === 'OG' || prev.hasOG,
        currentTier:
          type === 'Group'
            ? ProfileTier.GROUP
            : type === 'Pro'
              ? ProfileTier.PRO
              : type === 'OG'
                ? ProfileTier.OG
                : prev.currentTier,
        isLoading: false,
      }))
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
