'use client'
import { createConfig, http } from 'wagmi'
import { getChainConfig } from './chains'
import { QueryClient } from '@tanstack/react-query'

const { chain } = getChainConfig()

export const queryClient = new QueryClient()

export const wagmiConfig = createConfig({
  chains: [chain],
  transports: {
    [chain.id]: http(),
  },
})
