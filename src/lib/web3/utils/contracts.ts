import { type Address } from 'viem'
import { getContractAddresses } from '../config/chains'
import { getAddresses } from './addresses'

// Contract interface types
export interface ContractConfig {
  address: Address
  abi: any // TODO: Add proper ABI types
}

// Get contract configuration
export const getContract = (name: keyof ReturnType<typeof getAddresses>): ContractConfig => {
  const addresses = getAddresses()
  return {
    address: addresses[name] as Address,
    abi: [], // TODO: Import proper ABI
  }
}

// Get multiple contract configurations
export const getContracts = (names: Array<keyof ReturnType<typeof getAddresses>>) => {
  return names.reduce((acc, name) => {
    acc[name] = getContract(name)
    return acc
  }, {} as Record<string, ContractConfig>)
}

// Helper to get membership contracts
export const getMembershipContracts = () => {
  return getContracts(['TIER_CONTRACT', 'PRO_NFT', 'GROUP_NFT'])
}

// Helper to get profile system contracts
export const getProfileContracts = () => {
  return getContracts(['PROFILE_SYSTEM', 'PROFILE_REGISTRY', 'METADATA', 'ACCESS_CONTROL'])
}

// Export types
export type { ContractConfig }
