import { baseSepolia, base } from 'viem/chains'

// Environment checks
export const IS_PROD = process.env.NODE_ENV === 'production'
export const IS_MAINNET = process.env.NEXT_PUBLIC_NETWORK === 'mainnet'

// Chain IDs and Configurations
export const SUPPORTED_CHAINS = {
  BASE_MAINNET: base.id,
  BASE_SEPOLIA: baseSepolia.id,
} as const

// Export chain IDs for convenience
export const CHAIN_IDS = {
  BASE_MAINNET: SUPPORTED_CHAINS.BASE_MAINNET,
  BASE_SEPOLIA: SUPPORTED_CHAINS.BASE_SEPOLIA,
} as const

// RPC Configuration
export const RPC_URLS = {
  [SUPPORTED_CHAINS.BASE_MAINNET]:
    process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
  [SUPPORTED_CHAINS.BASE_SEPOLIA]:
    process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
} as const

// Chain configurations with RPC URLs
export const CHAIN_CONFIG = {
  [SUPPORTED_CHAINS.BASE_MAINNET]: {
    ...base,
    rpcUrls: {
      default: { http: [RPC_URLS[SUPPORTED_CHAINS.BASE_MAINNET]] },
      public: { http: [RPC_URLS[SUPPORTED_CHAINS.BASE_MAINNET]] },
    },
  },
  [SUPPORTED_CHAINS.BASE_SEPOLIA]: {
    ...baseSepolia,
    rpcUrls: {
      default: { http: [RPC_URLS[SUPPORTED_CHAINS.BASE_SEPOLIA]] },
      public: { http: [RPC_URLS[SUPPORTED_CHAINS.BASE_SEPOLIA]] },
    },
  },
} as const

// Types
export type SupportedChainId = (typeof SUPPORTED_CHAINS)[keyof typeof SUPPORTED_CHAINS]

// Helper functions
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return Object.values(SUPPORTED_CHAINS).includes(chainId as SupportedChainId)
}

export function getChainConfig(chainId: SupportedChainId) {
  const config = CHAIN_CONFIG[chainId]
  if (!config) {
    throw new Error(`Chain ${chainId} not supported`)
  }
  return config
}

// Active chain based on environment
export const ACTIVE_CHAIN = IS_MAINNET
  ? CHAIN_CONFIG[SUPPORTED_CHAINS.BASE_MAINNET]
  : CHAIN_CONFIG[SUPPORTED_CHAINS.BASE_SEPOLIA]

// Export individual chains for convenience
export const baseChain = CHAIN_CONFIG[SUPPORTED_CHAINS.BASE_MAINNET]
export const baseSepoliaChain = CHAIN_CONFIG[SUPPORTED_CHAINS.BASE_SEPOLIA]
