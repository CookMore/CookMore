import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { createPublicClient } from 'viem'

// Create the public client
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

// Create the Wagmi config
export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  publicClient,
})

// Optional hydration helper
export const hydrate = () => {
  if (typeof window !== 'undefined') {
    // Add any client-side initialization if needed
    // This can be useful for persisting connection state, etc.
  }
}
