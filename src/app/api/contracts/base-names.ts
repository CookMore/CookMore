export const BASE_NAMES_CONTRACT = {
  mainnet: '0x4E0dD84D98f8EA59Aa925195c66e10a7B0F388B5',
  // Base Sepolia testnet contract
  sepolia: '0x4c975dbc2fb0b0ee2b106e7ad48c2787163c6053', // Base Sepolia Names contract
}

export const BASE_NAMES_ABI = [
  // Base Names contract interface
  'function resolve(string) view returns (address)',
  'function reverseResolve(address) view returns (string)',
  'function register(string) payable',
  'function setReverse(string)',
] as const

// Network configuration
export const BASE_NETWORKS = {
  mainnet: {
    chainId: '0x2105', // 8453 in hex
    name: 'Base',
    rpc: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
  },
  sepolia: {
    chainId: '0x14a34', // 84532 in hex
    name: 'Base Sepolia',
    rpc: 'https://sepolia.base.org',
    explorer: 'https://sepolia.basescan.org',
  },
} as const

// Helper function to get current network config
export function getBaseNetwork(isTestnet = true) {
  return isTestnet ? BASE_NETWORKS.sepolia : BASE_NETWORKS.mainnet
}
