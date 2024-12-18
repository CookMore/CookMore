import { CONTRACT_ADDRESSES as CHAIN_CONTRACT_ADDRESSES } from '../config/chains'

// Base Mainnet Addresses
export const MAINNET_ADDRESSES = {
  TIER_CONTRACT: CHAIN_CONTRACT_ADDRESSES.mainnet.TIER_CONTRACT,
  PRO_CONTRACT: CHAIN_CONTRACT_ADDRESSES.mainnet.PRO_NFT,
  GROUP_CONTRACT: CHAIN_CONTRACT_ADDRESSES.mainnet.GROUP_NFT,
} as const

// Base Sepolia Addresses
export const TESTNET_ADDRESSES = {
  TIER_CONTRACT: CHAIN_CONTRACT_ADDRESSES.testnet.TIER_CONTRACT,
  PRO_CONTRACT: CHAIN_CONTRACT_ADDRESSES.testnet.PRO_NFT,
  GROUP_CONTRACT: CHAIN_CONTRACT_ADDRESSES.testnet.GROUP_NFT,
} as const

// Export contract addresses based on environment
export const CONTRACT_ADDRESSES =
  process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? MAINNET_ADDRESSES : TESTNET_ADDRESSES

export const {
  TIER_CONTRACT: TIER_CONTRACT_ADDRESS,
  PRO_CONTRACT: PRO_CONTRACT_ADDRESS,
  GROUP_CONTRACT: GROUP_CONTRACT_ADDRESS,
} = CONTRACT_ADDRESSES
