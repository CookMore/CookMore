'use client'

import { useState, useEffect } from 'react'
import { useAccount, useContractRead, useContractReads } from 'wagmi'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { tierABI } from '@/app/api/blockchain/abis/tier'
import { TIER_CONTRACT_ADDRESS } from '@/app/api/tiers/tiers'
import { getContract } from 'viem'
import { serializeBigInt } from '@/app/api/blockchain/utils'

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

  // Check if contract address is set and valid
  const isContractConfigured = TIER_CONTRACT_ADDRESS && TIER_CONTRACT_ADDRESS.startsWith('0x')

  console.log('Contract configuration:', {
    TIER_CONTRACT_ADDRESS,
    isContractConfigured,
  })

  // Use wagmi's useContractReads for batch reading
  const { data: balanceData } = useContractReads({
    contracts: [
      {
        address: TIER_CONTRACT_ADDRESS,
        abi: combinedABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
    ],
    watch: true,
    select: (data) => data,
  } as const)

  const balance = balanceData?.[0].result

  // Get all token indices for the user
  const tokenIndices = balance ? Array.from({ length: Number(balance) }, (_, i) => BigInt(i)) : []

  // Get all tokens for the user
  const { data: tokenData } = useContractReads({
    contracts: tokenIndices.map((index) => ({
      address: TIER_CONTRACT_ADDRESS,
      abi: combinedABI,
      functionName: 'tokenOfOwnerByIndex',
      args: [address as `0x${string}`, index],
    })),
    watch: true,
    select: (data) => data,
  } as const)

  // Get tier types for all tokens
  const { data: tierData } = useContractReads({
    contracts:
      tokenData?.map((token) => ({
        address: TIER_CONTRACT_ADDRESS,
        abi: combinedABI,
        functionName: 'tokenTier',
        args: [token.result],
      })) ?? [],
    watch: true,
    select: (data) => data,
  } as const)

  // Effect to update tier state based on contract data
  useEffect(() => {
    console.log('📊 NFT Contract Data:', {
      balance: balance ? Number(balance) : null,
      tokenCount: tokenData?.length ?? 0,
      tierTypes: tierData?.map((t) => t.result),
      isLoading: tierState.isLoading,
      isContractConfigured,
      TIER_CONTRACT_ADDRESS,
    })

    if (!mounted || !isConnected || !address || !isContractConfigured) {
      console.log('NFT Tiers: Early return due to missing requirements', {
        mounted,
        isConnected,
        address,
        isContractConfigured,
      })
      setTierState((prev) => ({ ...prev, isLoading: false }))
      return
    }

    if (balance && balance > 0n && tierData?.length) {
      let hasGroup = false
      let hasPro = false
      let hasOG = false
      let currentTier = ProfileTier.FREE

      // Check each token's tier
      tierData.forEach(({ result: type }) => {
        const tierType = String(type)
        console.log('Processing token tier:', { tierType })

        if (tierType === 'Group' || tierType === 'OG') {
          hasGroup = true
        }
        if (tierType === 'Pro' || tierType === 'Group' || tierType === 'OG') {
          hasPro = true
        }
        if (tierType === 'OG') {
          hasOG = true
        }

        // Update current tier if this token grants a higher tier
        const tokenTier =
          tierType === 'OG'
            ? ProfileTier.OG
            : tierType === 'Group'
              ? ProfileTier.GROUP
              : tierType === 'Pro'
                ? ProfileTier.PRO
                : ProfileTier.FREE

        if (tokenTier > currentTier) {
          currentTier = tokenTier
        }
      })

      const newTierState = {
        hasGroup,
        hasPro,
        hasOG,
        currentTier,
        isLoading: false,
      }

      console.log('Setting new tier state:', newTierState)
      setTierState(newTierState)
    } else {
      console.log('Setting default FREE tier state due to no valid tier data')
      setTierState({
        hasGroup: false,
        hasPro: false,
        hasOG: false,
        currentTier: ProfileTier.FREE,
        isLoading: false,
      })
    }
  }, [mounted, address, isConnected, balance, tokenData, tierData, isContractConfigured])

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    ...tierState,
    isContractConfigured,
  }
}
