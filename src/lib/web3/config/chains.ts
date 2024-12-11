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
    PROFILE_REGISTRY: '0x...', // TODO: Add mainnet addresses
    PROFILE_SYSTEM: '0x...',
    ACCESS_CONTROL: '0x...',
    METADATA: '0x...',

    // Membership NFTs
    TIER_CONTRACT: '0x...',
    PRO_NFT: '0x...',
    GROUP_NFT: '0x...',

    // Other contracts
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  testnet: {
    // Core Profile System
    PROFILE_REGISTRY: '0x4Ab687D7D89FC4FFc5F814e465Fa94346e9CEe5b',
    PROFILE_SYSTEM: '0x4Ab687D7D89FC4FFc5F814e465Fa94346e9CEe5b',
    ACCESS_CONTROL: '0x29298493c8269dA20fd89058ED2AA82799d148ab',
    METADATA: '0xA11522CD73c532D348bba775f22c9B14A112F65A',

    // Membership NFTs
    TIER_CONTRACT: '0xf7577d49C5F3C1b776Fe8757B5b973dcCa88D828',
    PRO_NFT: '0xa859Ca4cF5Fc201E710C1A8Dc8540beaa9878C02',
    GROUP_NFT: '0x6c927C8F1661460c5f3adDcd26d7698910077492',

    // Other contracts
    USDC: '0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897',
  },
} as const

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

// Helper functions
export const getChainConfig = () => (IS_MAINNET ? CHAIN_CONFIG.mainnet : CHAIN_CONFIG.testnet)
export const getContractAddresses = () =>
  IS_MAINNET ? CONTRACT_ADDRESSES.mainnet : CONTRACT_ADDRESSES.testnet

// Export supported chains
export const SUPPORTED_CHAINS = [baseChain, baseSepoliaChain] as const

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
export type SupportedChain = (typeof SUPPORTED_CHAINS)[number]
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
