export const CONTRACT_ADDRESSES = {
  // Base Testnet Addresses

  // Core Profile System
  PROFILE_REGISTRY: '0x4Ab687D7D89FC4FFc5F814e465Fa94346e9CEe5b',
  PROFILE_SYSTEM: '0x4Ab687D7D89FC4FFc5F814e465Fa94346e9CEe5b',
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
export const PROFILE_SYSTEM_ADDRESS = CONTRACT_ADDRESSES.PROFILE_SYSTEM
export const PROFILE_REGISTRY_ADDRESS = CONTRACT_ADDRESSES.PROFILE_REGISTRY
export const TIER_CONTRACT_ADDRESS = CONTRACT_ADDRESSES.TIER_CONTRACT
export const PRO_NFT_ADDRESS = CONTRACT_ADDRESSES.PRO_NFT
export const GROUP_NFT_ADDRESS = CONTRACT_ADDRESSES.GROUP_NFT
export const METADATA_ADDRESS = CONTRACT_ADDRESSES.METADATA
export const ACCESS_CONTROL_ADDRESS = CONTRACT_ADDRESSES.ACCESS_CONTROL

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
export const getTierType = (address: string): 'Pro' | 'Group' | 'unknown' => {
  switch (address.toLowerCase()) {
    case CONTRACT_ADDRESSES.PRO_NFT.toLowerCase():
      return 'Pro'
    case CONTRACT_ADDRESSES.GROUP_NFT.toLowerCase():
      return 'Group'
    default:
      return 'unknown'
  }
}

// Helper to validate address format
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Add this with your other exports
export const USDC_ADDRESS = '0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897'

export const ContractAddresses = {
  TIER_NFT_ADDRESS: '0xf7577d49C5F3C1b776Fe8757B5b973dcCa88D828',
  ACCESS_CONTROL_ADDRESS: '0x29298493c8269dA20fd89058ED2AA82799d148ab',
  METADATA_ADDRESS: '0xA11522CD73c532D348bba775f22c9B14A112F65A',
} as const

export type ContractAddressType = keyof typeof ContractAddresses
export type ContractAddress = (typeof ContractAddresses)[ContractAddressType]

export const getContractAddress = (name: ContractAddressType): ContractAddress => {
  return ContractAddresses[name]
}
