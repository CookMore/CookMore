import { createConfig } from 'wagmi'
import { coinbaseWallet } from '@wagmi/connectors'
import { http } from 'viem'
import { 
  SUPPORTED_CHAINS, 
  WALLET_CONFIG, 
  RPC_URLS,
  ACTIVE_CHAIN 
} from './index'

// Configure connectors
const connectors = [
  coinbaseWallet({
    appName: WALLET_CONFIG.coinbase.appName,
    appLogoUrl: WALLET_CONFIG.coinbase.appLogoUrl,
    chains: SUPPORTED_CHAINS,
  })
]

// Configure transport
const transport = http()

// Create wagmi config
export const config = createConfig({
  chains: SUPPORTED_CHAINS,
  connectors,
  transports: {
    [SUPPORTED_CHAINS[0].id]: transport,
    [SUPPORTED_CHAINS[1].id]: transport,
  },
})

// Export public client for direct usage
export const publicClient = config.publicClient

// Re-export chain configuration
export { SUPPORTED_CHAINS, ACTIVE_CHAIN }
