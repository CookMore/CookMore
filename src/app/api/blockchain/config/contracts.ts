import { Address } from 'viem'
import { RecipeABI } from '../abis/metadata'
import { ProfileRegistryABI } from '../abis/profile'
import { TierABI } from '../abis/tier'

// Contract addresses for different environments
const MAINNET_CONTRACTS = {
  PROFILE: process.env.NEXT_PUBLIC_PROFILE_CONTRACT_ADDRESS,
  TIER: process.env.NEXT_PUBLIC_TIER_CONTRACT_ADDRESS,
  USDC: process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS,
} as const

const TESTNET_CONTRACTS = {
  PROFILE: process.env.NEXT_PUBLIC_TESTNET_PROFILE_REGISTRY,
  TIER: process.env.NEXT_PUBLIC_TESTNET_TIER_CONTRACT,
  USDC: '0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897' as Address,
} as const

const LOCAL_CONTRACTS = {
  PROFILE: process.env.NEXT_PUBLIC_PROFILE_CONTRACT_ADDRESS,
  TIER: process.env.NEXT_PUBLIC_TIER_CONTRACT_ADDRESS,
  USDC: '0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897' as Address,
} as const

// Select contracts based on environment
export const CONTRACTS =
  process.env.NEXT_PUBLIC_NETWORK_ENV === 'mainnet'
    ? MAINNET_CONTRACTS
    : process.env.NEXT_PUBLIC_NETWORK_ENV === 'testnet'
      ? TESTNET_CONTRACTS
      : LOCAL_CONTRACTS

// Type guard to check if an address is valid
export function isValidContractAddress(address: string | undefined): address is Address {
  return typeof address === 'string' && address.startsWith('0x') && address.length === 42
}

// Validate contract addresses
Object.entries(CONTRACTS).forEach(([name, address]) => {
  if (!isValidContractAddress(address)) {
    console.warn(`Invalid or missing contract address for ${name}`)
  }
})

export const contracts = {
  recipe: {
    address: process.env.NEXT_PUBLIC_TESTNET_METADATA,
    abi: RecipeABI,
  },

  profile: {
    address: CONTRACTS.PROFILE,
    abi: ProfileRegistryABI,
  },
  tier: {
    address: CONTRACTS.TIER,
    abi: TierABI,
  },
}
