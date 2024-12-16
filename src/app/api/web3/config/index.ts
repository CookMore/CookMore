import { base, baseSepolia } from 'viem/chains'

// Environment checks
export const IS_PROD = process.env.NODE_ENV === 'production'
export const IS_MAINNET = process.env.NEXT_PUBLIC_NETWORK === 'mainnet'

// Chain Configuration
export const ACTIVE_CHAIN = IS_MAINNET ? base : baseSepolia
export const SUPPORTED_CHAINS = [base, baseSepolia] as const
export const CHAIN_IDS = {
  BASE_MAINNET: base.id,
  BASE_SEPOLIA: baseSepolia.id,
} as const

// RPC Configuration
export const RPC_URLS = {
  [base.id]: process.env.NEXT_PUBLIC_BASE_RPC_URL,
  [baseSepolia.id]: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
} as const

// Wallet Configuration
export const WALLET_CONFIG = {
  coinbase: {
    appName: process.env.NEXT_PUBLIC_COINBASE_APP_NAME || 'CookMore',
    appLogoUrl:
      process.env.NEXT_PUBLIC_COINBASE_APP_LOGO_URL || '/icons/brand/base-logo-in-blue.svg',
  },
  walletConnect: {
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  },
} as const

// IPFS Configuration
export const IPFS_CONFIG = {
  infura: {
    projectId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
    apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY,
    apiSecret: process.env.NEXT_PUBLIC_INFURA_API_SECRET,
  },
  pinata: {
    apiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
    apiSecret: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
    jwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  },
} as const

// Contract Addresses
export const CONTRACT_ADDRESSES = {
  recipe: process.env.NEXT_PUBLIC_RECIPE_CONTRACT_ADDRESS,
  profile: process.env.NEXT_PUBLIC_PROFILE_CONTRACT_ADDRESS,
} as const

// Type exports
export type SupportedChainId = (typeof CHAIN_IDS)[keyof typeof CHAIN_IDS]
export type SupportedChain = (typeof SUPPORTED_CHAINS)[number]
