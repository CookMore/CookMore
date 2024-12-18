import { createPublicClient, http } from 'viem'
import { ACTIVE_CHAIN, RPC_URLS } from './chains'
import { CONTRACTS } from './contracts'

// Public client for direct contract calls
export const publicClient = createPublicClient({
  chain: ACTIVE_CHAIN,
  transport: http(RPC_URLS[ACTIVE_CHAIN.id]),
  batch: {
    multicall: true,
  },
})

// Contract configuration with addresses
export const CONTRACT_CONFIG = {
  addresses: CONTRACTS,
  publicClient,
}

// Export the active configuration
export const activeConfig = {
  chain: ACTIVE_CHAIN,
  publicClient,
  contracts: CONTRACT_CONFIG,
}
