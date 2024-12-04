export const CONTRACT_ADDRESSES = {
  // Base Testnet Addresses

  // Core Profile System
  PROFILE_REGISTRY: '0x4Ab687D7D89FC4FFc5F814e465Fa94346e9CEe5b',
  ACCESS_CONTROL: '0x29298493c8269dA20fd89058ED2AA82799d148ab',
  METADATA: '0xA11522CD73c532D348bba775f22c9B14A112F65A',

  // Membership NFTs
  TIER_CONTRACT: '0xf7577d49C5F3C1b776Fe8757B5b973dcCa88D828',
  PRO_NFT: '0xa859Ca4cF5Fc201E710C1A8Dc8540beaa9878C02',
  GROUP_NFT: '0x6c927C8F1661460c5f3adDcd26d7698910077492',
} as const

// Type for network-specific addresses
export type ContractAddresses = typeof CONTRACT_ADDRESSES

// Direct exports for commonly used addresses
export const PROFILE_REGISTRY_ADDRESS = CONTRACT_ADDRESSES.PROFILE_REGISTRY
export const TIER_CONTRACT_ADDRESS = CONTRACT_ADDRESSES.TIER_CONTRACT
export const PRO_NFT_ADDRESS = CONTRACT_ADDRESSES.PRO_NFT
export const GROUP_NFT_ADDRESS = CONTRACT_ADDRESSES.GROUP_NFT
export const METADATA_ADDRESS = CONTRACT_ADDRESSES.METADATA

// Helper to get all membership-related addresses
export const getMembershipAddresses = () => ({
  tier: TIER_CONTRACT_ADDRESS,
  pro: PRO_NFT_ADDRESS,
  group: GROUP_NFT_ADDRESS,
})

// Helper to check if address is a membership token
export const isMembershipToken = (address: string): boolean => {
  const membershipAddresses = [
    CONTRACT_ADDRESSES.PRO_NFT,
    CONTRACT_ADDRESSES.GROUP_NFT,
    CONTRACT_ADDRESSES.TIER_CONTRACT,
  ]
  return membershipAddresses.includes(address as any)
}

// Helper to get tier type from token contract
export const getTierType = (address: string): 'pro' | 'group' | 'unknown' => {
  switch (address.toLowerCase()) {
    case CONTRACT_ADDRESSES.PRO_NFT.toLowerCase():
      return 'pro'
    case CONTRACT_ADDRESSES.GROUP_NFT.toLowerCase():
      return 'group'
    default:
      return 'unknown'
  }
}

// Helper to validate address format
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}
