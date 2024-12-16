import { type Network } from 'ethers'

export interface ChainConfig {
  chainId: number
  name: string
  rpcUrl: string
  blockExplorer: string
  contracts: {
    profileRegistry: string
    metadata: string
    proNFT: string
    groupNFT: string
  }
}

// Base Mainnet configuration
export const BASE_MAINNET: ChainConfig = {
  chainId: 8453,
  name: 'Base',
  rpcUrl: 'https://mainnet.base.org',
  blockExplorer: 'https://basescan.org',
  contracts: {
    profileRegistry: '0x0000000000000000000000000000000000000000', // TODO: Update with mainnet address
    metadata: '0x0000000000000000000000000000000000000000', // TODO: Update with mainnet address
    proNFT: '0x0000000000000000000000000000000000000000', // TODO: Update with mainnet address
    groupNFT: '0x0000000000000000000000000000000000000000', // TODO: Update with mainnet address
  },
}

// Base Sepolia (testnet) configuration
export const BASE_SEPOLIA: ChainConfig = {
  chainId: 84532,
  name: 'Base Sepolia',
  rpcUrl: 'https://sepolia.base.org',
  blockExplorer: 'https://sepolia.basescan.org',
  contracts: {
    profileRegistry: '0x4Ab687D7D89FC4FFc5F814e465Fa94346e9CEe5b',
    metadata: '0xf7577d49C5F3C1b776Fe8757B5b973dcCa88D828',
    proNFT: '0xa859Ca4cF5Fc201E710C1A8Dc8540beaa9878C02',
    groupNFT: '0x6c927C8F1661460c5f3adDcd26d7698910077492',
  },
}

// Get network configuration based on environment
export function getNetworkConfig(): ChainConfig {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID
    ? parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)
    : 84532 // Default to Base Sepolia

  return chainId === 8453 ? BASE_MAINNET : BASE_SEPOLIA
}

// Get ethers Network object for provider configuration
export function getEthersNetwork(): Network {
  const config = getNetworkConfig()
  return {
    chainId: config.chainId,
    name: config.name,
  }
}

// Get RPC URL based on environment
export function getRpcUrl(): string {
  return process.env.NEXT_PUBLIC_RPC_URL || getNetworkConfig().rpcUrl
}
