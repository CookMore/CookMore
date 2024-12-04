import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
})

export const hydrate = () => {
  // Hydration logic if needed
  if (typeof window !== 'undefined') {
    // Any client-side initialization
  }
}
