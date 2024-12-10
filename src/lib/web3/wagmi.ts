import { createConfig } from 'wagmi'
import { base, baseSepolia } from 'viem/chains'
import { http } from 'viem'
import { createPublicClient, fallback, webSocket } from 'viem'

// Configure the chains and providers
const transport = http()

// Create public client
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport,
})

// Create wagmi config
export const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: transport,
    [baseSepolia.id]: transport,
  },
})

// Chain IDs for reference
export const SUPPORTED_CHAINS = {
  BASE_MAINNET: base.id, // 8453
  BASE_SEPOLIA: baseSepolia.id, // 84532
} as const
