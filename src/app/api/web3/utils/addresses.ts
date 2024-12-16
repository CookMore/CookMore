import { getContractAddresses } from '../config/chains'

export const getAddresses = () => {
  const network = process.env.NEXT_PUBLIC_NETWORK || 'testnet'

  if (network === 'testnet') {
    const addresses = {
      PROFILE_SYSTEM: process.env.NEXT_PUBLIC_TESTNET_PROFILE_SYSTEM,
      PROFILE_REGISTRY: process.env.NEXT_PUBLIC_TESTNET_PROFILE_REGISTRY,
      TIER_CONTRACT: process.env.NEXT_PUBLIC_TESTNET_TIER_CONTRACT,
      PRO_NFT: process.env.NEXT_PUBLIC_TESTNET_PRO_NFT,
      GROUP_NFT: process.env.NEXT_PUBLIC_TESTNET_GROUP_NFT,
      METADATA: process.env.NEXT_PUBLIC_TESTNET_METADATA,
      ACCESS_CONTROL: process.env.NEXT_PUBLIC_TESTNET_ACCESS_CONTROL,
    }

    // Verify all addresses are defined
    Object.entries(addresses).forEach(([key, value]) => {
      if (!value) {
        throw new Error(`Missing contract address for ${key}`)
      }
    })

    return addresses as Record<keyof typeof addresses, string>
  }

  // Add mainnet addresses when ready
  throw new Error('Network not supported')
}

// Helper to get all membership-related addresses
export const getMembershipAddresses = () => {
  const addresses = getAddresses()
  return {
    tier: addresses.TIER_CONTRACT,
    pro: addresses.PRO_NFT,
    group: addresses.GROUP_NFT,
  } as const
}

// Re-export helper functions
export { isMembershipToken, getTierType, isValidAddress } from '../config/chains'

// Types
export type { ContractAddresses, ContractName } from '../config/chains'
