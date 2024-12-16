import { createConfig } from 'wagmi'
import { base, baseSepolia } from 'viem/chains'
import { createPublicClient, http } from 'viem'

// Environment configuration
export const IS_MAINNET = process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
export const CHAIN = IS_MAINNET ? base : baseSepolia

// RPC URLs
const RPC_URLS = {
  [base.id]: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
  [baseSepolia.id]: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
} as const

// Public client for direct contract calls
export const publicClient = createPublicClient({
  chain: CHAIN,
  transport: http(RPC_URLS[CHAIN.id]),
  batch: {
    multicall: true,
  },
})

// Wagmi config for hooks
export const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(RPC_URLS[base.id]),
    [baseSepolia.id]: http(RPC_URLS[baseSepolia.id]),
  },
})

// Contract configuration
export const CONTRACT_CONFIG = {
  // Core NFTs
  RecipeNFT: {
    address: IS_MAINNET
      ? '0x...' // Mainnet address (to be deployed)
      : ('0x390F83b22438925B02c9788D51e0779d482CD9eD' as const),
    abi: [] as const,
  },

  // Registry Contracts
  Registry: {
    address: IS_MAINNET
      ? '0x...' // Mainnet address (to be deployed)
      : ('0xBaaF41cd0A65868be2789026837098Fa9Af0ecd9' as const),
    abi: [] as const,
  },
  ProfileRegistry: {
    address: IS_MAINNET
      ? '0x...' // Mainnet address (to be deployed)
      : ('0xd7a200d3e490C1Fad37459EBa8C6d3b4E0c1Bb83' as const),
    abi: [] as const,
  },

  // Membership Tokens
  CookMoreProToken: {
    address: IS_MAINNET
      ? '0x...' // Mainnet address (to be deployed)
      : ('0xa859Ca4cF5Fc201E710C1A8Dc8540beaa9878C02' as const),
    abi: [] as const,
  },
  CookMoreGroupToken: {
    address: IS_MAINNET
      ? '0x...' // Mainnet address (to be deployed)
      : ('0x6c927C8F1661460c5f3adDcd26d7698910077492' as const),
    abi: [] as const,
  },
  TierContract: {
    address: IS_MAINNET
      ? '0x...' // Mainnet address (to be deployed)
      : ('0xf7577d49C5F3C1b776Fe8757B5b973dcCa88D828' as const),
    abi: [] as const,
  },

  // System Contracts
  VersionControl: {
    address: IS_MAINNET
      ? '0x...' // Mainnet address (to be deployed)
      : ('0xEC9C419756d07775a8e14A5871550fF8b87A7570' as const),
    abi: [] as const,
  },
  PrivacySettings: {
    address: IS_MAINNET
      ? '0x...' // Mainnet address (to be deployed)
      : ('0xEe49C09b5462D110123E144A775e8B30BFC05B6C' as const),
    abi: [] as const,
  },
  ChangeLog: {
    address: IS_MAINNET
      ? '0x...' // Mainnet address (to be deployed)
      : ('0x5287d1E349023417758C2d9a3302518fcFb678d3' as const),
    abi: [] as const,
  },
} as const

// Network configuration
export const NETWORK_CONFIG = {
  mainnet: {
    chainId: base.id,
    name: 'Base',
    contracts: {
      // Core NFTs
      RecipeNFT: '0x...', // Mainnet address (to be deployed)

      // Registry Contracts
      Registry: '0x...',
      ProfileRegistry: '0x...',

      // Membership Tokens
      CookMoreProToken: '0x...',
      CookMoreGroupToken: '0x...',
      TierContract: '0x...',

      // System Contracts
      VersionControl: '0x...',
      PrivacySettings: '0x...',
      ChangeLog: '0x...',
    },
  },
  testnet: {
    chainId: baseSepolia.id,
    name: 'Base Sepolia',
    contracts: {
      // Core NFTs
      RecipeNFT: '0x390F83b22438925B02c9788D51e0779d482CD9eD',

      // Registry Contracts
      Registry: '0xBaaF41cd0A65868be2789026837098Fa9Af0ecd9',
      ProfileRegistry: '0xd7a200d3e490C1Fad37459EBa8C6d3b4E0c1Bb83',

      // Membership Tokens
      CookMoreProToken: '0xa859Ca4cF5Fc201E710C1A8Dc8540beaa9878C02',
      CookMoreGroupToken: '0x6c927C8F1661460c5f3adDcd26d7698910077492',
      TierContract: '0xf7577d49C5F3C1b776Fe8757B5b973dcCa88D828',

      // System Contracts
      VersionControl: '0xEC9C419756d07775a8e14A5871550fF8b87A7570',
      PrivacySettings: '0xEe49C09b5462D110123E144A775e8B30BFC05B6C',
      ChangeLog: '0x5287d1E349023417758C2d9a3302518fcFb678d3',
    },
  },
} as const

// Type definitions
export type ContractName = keyof typeof CONTRACT_CONFIG
export type NetworkType = keyof typeof NETWORK_CONFIG

// Helper functions
export const getContract = (name: ContractName) => CONTRACT_CONFIG[name]
export const getContractAddress = (name: ContractName) => CONTRACT_CONFIG[name].address
export const getNetwork = (type: NetworkType) => NETWORK_CONFIG[type]

// Contract instance helpers
export const getContractInstance = (name: ContractName) => ({
  address: getContractAddress(name),
  abi: getContract(name).abi,
  publicClient,
})

// Export chains for use in other parts of the app
export const chains = [base, baseSepolia]
