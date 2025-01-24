import { Address } from 'viem'
import { IS_MAINNET } from '../config/chains'

// Define a common type for both address objects
type AddressKeys = {
  RECIPE_NFT: Address
  PROFILE_REGISTRY: Address
  TIER_CONTRACT: Address
  STICKY_NOTE: Address
  ACCESS_CONTROL: Address
  METADATA: Address
  VERSION_CONTROL: Address
  PRIVACY_SETTINGS: Address
  CHANGE_LOG: Address
  REGISTRY?: Address // Optional if not present in both
}

// Contract addresses for Base Sepolia testnet
export const TESTNET_ADDRESSES: AddressKeys = {
  RECIPE_NFT: '0x390F83b22438925B02c9788D51e0779d482CD9eD' as Address,
  PROFILE_REGISTRY: '0x0C3897538e000dAdAEA1bb10D5757fC473972018' as Address,
  TIER_CONTRACT: '0x947b40801581E896C29dD73f9C7f5dd710877b64' as Address,
  STICKY_NOTE: '0xA5265C7B7B63f73b6c0Fc0a9034219e4B39372e6' as Address,
  ACCESS_CONTROL: '0x771ea79cA72E32E693E38A91091fECD42ef351B8' as Address,
  METADATA: '0xa8A2f9f45025Ad81Af72B6D6AEa054B5BeFF7310' as Address,
  VERSION_CONTROL: '0xEC9C419756d07775a8e14A5871550fF8b87A7570' as Address,
  PRIVACY_SETTINGS: '0xEe49C09b5462D110123E144A775e8B30BFC05B6C' as Address,
  CHANGE_LOG: '0x5287d1E349023417758C2d9a3302518fcFb678d3' as Address,
}

// Contract addresses for Base mainnet
export const MAINNET_ADDRESSES: AddressKeys = {
  RECIPE_NFT: '' as Address,
  PROFILE_REGISTRY: '' as Address,
  TIER_CONTRACT: '' as Address,
  STICKY_NOTE: '' as Address,
  ACCESS_CONTROL: '' as Address,
  METADATA: '' as Address,
  VERSION_CONTROL: '' as Address,
  PRIVACY_SETTINGS: '' as Address,
  CHANGE_LOG: '' as Address,
  REGISTRY: '' as Address, // Ensure this key is present if used
}

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
