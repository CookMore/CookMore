'use client'
import { createConfig, http } from 'wagmi'
import { CHAIN_CONFIG, SUPPORTED_CHAINS, RPC_URLS } from './chains'

// Create wagmi config with our chain configuration
export const wagmiConfig = createConfig({
  chains: Object.values(CHAIN_CONFIG),
  transports: {
    [SUPPORTED_CHAINS.BASE_MAINNET]: http(RPC_URLS[SUPPORTED_CHAINS.BASE_MAINNET]),
    [SUPPORTED_CHAINS.BASE_SEPOLIA]: http(RPC_URLS[SUPPORTED_CHAINS.BASE_SEPOLIA]),
  },
})
