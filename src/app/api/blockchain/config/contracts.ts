import { Address, isAddress } from 'viem'
import { recipeABI } from '../abis/recipe'
import { profileABI } from '../abis/profile'
import { tierABI } from '../abis/tier'

// Contract addresses for different environments
const MAINNET_CONTRACTS = {
  PROFILE: process.env.NEXT_PUBLIC_PROFILE_CONTRACT_ADDRESS,
  TIER: process.env.NEXT_PUBLIC_TIER_CONTRACT_ADDRESS,
  USDC: process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS,
  ACCESS_CONTROL: process.env.NEXT_PUBLIC_ACCESS_CONTROL_ADDRESS,
} as const

const TESTNET_CONTRACTS = {
  PROFILE: process.env.NEXT_PUBLIC_TESTNET_PROFILE_REGISTRY,
  TIER: process.env.NEXT_PUBLIC_TESTNET_TIER_CONTRACT,
  USDC: '0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897' as Address,
  ACCESS_CONTROL: process.env.NEXT_PUBLIC_TESTNET_ACCESS_CONTROL,
} as const

const LOCAL_CONTRACTS = {
  PROFILE: process.env.NEXT_PUBLIC_TESTNET_PROFILE_REGISTRY,
  TIER: process.env.NEXT_PUBLIC_TESTNET_TIER_CONTRACT,
  USDC: '0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897' as Address,
  ACCESS_CONTROL: process.env.NEXT_PUBLIC_TESTNET_ACCESS_CONTROL,
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
    console.warn(`Invalid or missing contract address for ${name}:`, address)
  }
})

export const validateContractAddress = (address: string | undefined): string => {
  if (!address || !isAddress(address)) {
    throw new Error(`Invalid contract address: ${address}`)
  }
  return address
}

export const getContractConfig = (address: string, abi: any) => {
  const validAddress = validateContractAddress(address)
  return {
    address: validAddress,
    abi,
  }
}

export const contracts = {
  recipe: {
    address: process.env.NEXT_PUBLIC_TESTNET_METADATA,
    abi: recipeABI,
  },

  profile: {
    address: CONTRACTS.PROFILE,
    abi: profileABI,
  },
  tier: {
    address: CONTRACTS.TIER,
    abi: tierABI,
  },
}
