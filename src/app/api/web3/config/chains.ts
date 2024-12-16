import { base, baseSepolia } from 'viem/chains'
import { Chain } from 'viem'
import { type Network } from 'ethers'

// Environment-based configuration
export const IS_MAINNET = process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
export const ACTIVE_CHAIN = IS_MAINNET ? base : baseSepolia

// Custom chain configuration with RPC URLs
export const baseChain: Chain = {
  ...base,
  rpcUrls: {
    ...base.rpcUrls,
    default: {
      http: [process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'],
    },
  },
}

export const baseSepoliaChain: Chain = {
  ...baseSepolia,
  rpcUrls: {
    ...baseSepolia.rpcUrls,
    default: {
      http: [process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'],
    },
  },
}

// Contract addresses configuration
export const CONTRACT_ADDRESSES = {
  mainnet: {
    // Core Profile System
    PROFILE_REGISTRY: process.env.NEXT_PUBLIC_MAINNET_PROFILE_REGISTRY as `0x${string}`,
    PROFILE_SYSTEM: process.env.NEXT_PUBLIC_MAINNET_PROFILE_SYSTEM as `0x${string}`,
    ACCESS_CONTROL: process.env.NEXT_PUBLIC_MAINNET_ACCESS_CONTROL as `0x${string}`,
    METADATA: process.env.NEXT_PUBLIC_MAINNET_METADATA as `0x${string}`,

    // Membership NFTs
    TIER_CONTRACT: process.env.NEXT_PUBLIC_MAINNET_TIER_CONTRACT as `0x${string}`,
    PRO_NFT: process.env.NEXT_PUBLIC_MAINNET_PRO_NFT as `0x${string}`,
    GROUP_NFT: process.env.NEXT_PUBLIC_MAINNET_GROUP_NFT as `0x${string}`,
  },
  testnet: {
    // Core Profile System
    PROFILE_REGISTRY: process.env.NEXT_PUBLIC_TESTNET_PROFILE_REGISTRY as `0x${string}`,
    PROFILE_SYSTEM: process.env.NEXT_PUBLIC_TESTNET_PROFILE_SYSTEM as `0x${string}`,
    ACCESS_CONTROL: process.env.NEXT_PUBLIC_TESTNET_ACCESS_CONTROL as `0x${string}`,
    METADATA: process.env.NEXT_PUBLIC_TESTNET_METADATA as `0x${string}`,

    // Membership NFTs
    TIER_CONTRACT: process.env.NEXT_PUBLIC_TESTNET_TIER_CONTRACT as `0x${string}`,
    PRO_NFT: process.env.NEXT_PUBLIC_TESTNET_PRO_NFT as `0x${string}`,
    GROUP_NFT: process.env.NEXT_PUBLIC_TESTNET_GROUP_NFT as `0x${string}`,
  },
}

// Chain configurations with contracts
export const CHAIN_CONFIG = {
  mainnet: {
    chain: baseChain,
    name: 'Base',
    contracts: CONTRACT_ADDRESSES.mainnet,
  },
  testnet: {
    chain: baseSepoliaChain,
    name: 'Base Sepolia',
    contracts: CONTRACT_ADDRESSES.testnet,
  },
} as const

// Chain IDs
export const chainIds = {
  BASE_MAINNET: baseChain.id,
  BASE_SEPOLIA: baseSepoliaChain.id,
} as const

// Chain Names
export const chainNames = {
  [chainIds.BASE_MAINNET]: CHAIN_CONFIG.mainnet.name,
  [chainIds.BASE_SEPOLIA]: CHAIN_CONFIG.testnet.name,
} as const

// Types
export type SupportedChainId = (typeof chainIds)[keyof typeof chainIds]
export type SupportedChain = (typeof SUPPORTED_CHAINS)[keyof typeof SUPPORTED_CHAINS]
export type ContractAddresses = typeof CONTRACT_ADDRESSES.testnet
export type ContractName = keyof ContractAddresses

// Helper functions for contracts
export const isMembershipToken = (address: string): boolean => {
  const addresses = getContractAddresses()
  return [addresses.PRO_NFT, addresses.GROUP_NFT, addresses.TIER_CONTRACT].includes(address as any)
}

export const getTierType = (address: string): 'Pro' | 'Group' | 'unknown' => {
  const addresses = getContractAddresses()
  switch (address.toLowerCase()) {
    case addresses.PRO_NFT.toLowerCase():
      return 'Pro'
    case addresses.GROUP_NFT.toLowerCase():
      return 'Group'
    default:
      return 'unknown'
  }
}

export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Chain helper functions
export const getChainConfig = () => (IS_MAINNET ? CHAIN_CONFIG.mainnet : CHAIN_CONFIG.testnet)
export const getContractAddresses = () =>
  IS_MAINNET ? CONTRACT_ADDRESSES.mainnet : CONTRACT_ADDRESSES.testnet

export function isChainSupported(chainId: SupportedChainId): boolean {
  return Object.values(chainIds).includes(chainId)
}

export function getChainName(chainId: SupportedChainId): string {
  return chainNames[chainId] || `Unknown Chain (${chainId})`
}

// Export supported chains
export const SUPPORTED_CHAINS = chainIds
