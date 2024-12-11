import { getContractAddresses } from '../config/chains'

// Direct exports for commonly used addresses
export const getAddresses = () => {
  const addresses = getContractAddresses()
  return {
    PROFILE_SYSTEM: addresses.PROFILE_SYSTEM,
    PROFILE_REGISTRY: addresses.PROFILE_REGISTRY,
    TIER_CONTRACT: addresses.TIER_CONTRACT,
    PRO_NFT: addresses.PRO_NFT,
    GROUP_NFT: addresses.GROUP_NFT,
    METADATA: addresses.METADATA,
    ACCESS_CONTROL: addresses.ACCESS_CONTROL,
    USDC: addresses.USDC,
  } as const
}

// Helper to get all membership-related addresses
export const getMembershipAddresses = () => {
  const addresses = getContractAddresses()
  return {
    tier: addresses.TIER_CONTRACT,
    pro: addresses.PRO_NFT,
    group: addresses.GROUP_NFT,
  } as const
}

// Re-export helper functions from chains
export { isMembershipToken, getTierType, isValidAddress } from '../config/chains'

// Types
export type { ContractAddresses, ContractName } from '../config/chains'
