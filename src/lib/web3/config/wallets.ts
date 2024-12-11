import { coinbaseWallet } from '@wagmi/connectors/coinbaseWallet'
import { base, baseSepolia } from 'viem/chains'
import { http } from 'viem'

// Environment-based configuration
const IS_MAINNET = process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
const ACTIVE_CHAIN = IS_MAINNET ? base : baseSepolia

// App metadata
export const APP_CONFIG = {
  name: 'CookMore',
  description: 'Web3 Recipe Management',
  url: 'https://cookmore.food',
  icons: ['/icons/brand/base-logo-in-blue.svg']
} as const

// Connector configuration
export const connectors = [
  coinbaseWallet({
    appName: APP_CONFIG.name,
    chains: [base, baseSepolia],
  })
]

// Transport configuration
export const transport = http()

// Chain configuration
export const chains = [base, baseSepolia]
