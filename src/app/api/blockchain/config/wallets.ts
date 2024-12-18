import { coinbaseWallet } from '@wagmi/connectors'
import { CHAIN_CONFIG, SUPPORTED_CHAINS } from './chains'

// App metadata
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'CookMore',
  description: 'Web3 Recipe Management',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://cookmore.food',
  icons: ['/icons/brand/base-logo-in-blue.svg'],
} as const

// Available chains for wallets
const availableChains = Object.values(CHAIN_CONFIG)

// Coinbase Wallet configuration
export const coinbaseConfig = coinbaseWallet({
  appName: APP_CONFIG.name,
  chains: availableChains,
})

// Export all available connectors
export const connectors = [coinbaseConfig]

// Export supported chains for wallet connections
export const supportedChains = availableChains
