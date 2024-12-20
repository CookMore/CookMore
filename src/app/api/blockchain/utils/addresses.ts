import { Address } from 'viem'
import { IS_MAINNET } from '../config/chains'

// Contract addresses for Base Sepolia testnet
export const TESTNET_ADDRESSES = {
  // Core NFTs
  RECIPE_NFT: '0x390F83b22438925B02c9788D51e0779d482CD9eD' as Address,

  // Registry Contracts
  PROFILE_REGISTRY: '0x0C3897538e000dAdAEA1bb10D5757fC473972018' as Address,
  REGISTRY: '0xBaaF41cd0A65868be2789026837098Fa9Af0ecd9' as Address,

  // Membership Tokens
  TIER_CONTRACT: '0x947b40801581E896C29dD73f9C7f5dd710877b64' as Address,

  // System Contracts
  ACCESS_CONTROL: '0x771ea79cA72E32E693E38A91091fECD42ef351B8' as Address,
  METADATA: '0xa8A2f9f45025Ad81Af72B6D6AEa054B5BeFF7310' as Address,
  VERSION_CONTROL: '0xEC9C419756d07775a8e14A5871550fF8b87A7570' as Address,
  PRIVACY_SETTINGS: '0xEe49C09b5462D110123E144A775e8B30BFC05B6C' as Address,
  CHANGE_LOG: '0x5287d1E349023417758C2d9a3302518fcFb678d3' as Address,
} as const

// Contract addresses for Base mainnet (to be filled when deployed)
export const MAINNET_ADDRESSES = {
  // Core NFTs
  RECIPE_NFT: '' as Address,

  // Registry Contracts
  PROFILE_REGISTRY: '' as Address,
  REGISTRY: '' as Address,

  // Membership Tokens
  TIER_CONTRACT: '' as Address,

  // System Contracts
  ACCESS_CONTROL: '' as Address,
  METADATA: '' as Address,
  VERSION_CONTROL: '' as Address,
  PRIVACY_SETTINGS: '' as Address,
  CHANGE_LOG: '' as Address,
} as const

// Type for contract addresses
export type ContractAddresses = typeof TESTNET_ADDRESSES
export type ContractName = keyof ContractAddresses

// Helper functions
export function getContractAddresses() {
  return IS_MAINNET ? MAINNET_ADDRESSES : TESTNET_ADDRESSES
}

export function getContractAddress(contract: ContractName): Address {
  const addresses = getContractAddresses()
  const address = addresses[contract]

  if (!address) {
    throw new Error(`No address found for contract ${contract}`)
  }

  return address
}
