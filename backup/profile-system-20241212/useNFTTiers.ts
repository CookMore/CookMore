'use client'

import { useState, useEffect } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { GROUP_NFT_ABI } from '@/lib/web3/abis'
import { getAddresses } from '@/lib/web3/utils/addresses'
import { ProfileTier } from '@/app/api/types/profile'

export function useNFTTiers() {
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  const addresses = getAddresses()

  // First check balance
  const { data: nftBalance = BigInt(0), isLoading: balanceLoading } = useContractRead({
    address: addresses.GROUP_NFT,
    abi: GROUP_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: mounted && isConnected && !!address,
  })

  // Only get first token if balance > 0
  const { data: firstToken, isLoading: tokenLoading } = useContractRead({
    address: addresses.GROUP_NFT,
    abi: GROUP_NFT_ABI,
    functionName: 'tokenOfOwnerByIndex',
    args: nftBalance > BigInt(0) ? [address, BigInt(0)] : undefined,
    enabled: mounted && isConnected && !!address && nftBalance > BigInt(0),
  })

  // Check if token is group tier
  const { data: isGroup = false } = useContractRead({
    address: addresses.GROUP_NFT,
    abi: GROUP_NFT_ABI,
    functionName: 'isGroupTier',
    args: firstToken ? [firstToken] : undefined,
    enabled: mounted && isConnected && !!address && !!firstToken,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const hasNFT = nftBalance > BigInt(0) && !!firstToken
  const currentTier = hasNFT ? (isGroup ? ProfileTier.GROUP : ProfileTier.PRO) : ProfileTier.FREE

  return {
    hasGroup: hasNFT && isGroup,
    hasPro: hasNFT && !isGroup,
    currentTier,
    isLoading: !mounted || balanceLoading || (nftBalance > BigInt(0) && tokenLoading),
  }
}
