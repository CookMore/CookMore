import { User } from '@privy-io/react-auth'
import type { Chain } from 'viem'
import type { ReactNode } from 'react'
import { baseSepolia, base } from 'viem/chains'

declare module '@privy-io/react-auth' {
  // Define supported Base chains
  type SupportedChains = typeof base | typeof baseSepolia

  // Props interface for PrivyProvider component
  interface PrivyProviderProps {
    appId: string
    config: PrivyClientConfig
    children: ReactNode
    onSuccess?: (user: User | null) => Promise<void> | void
    onLogout?: () => void
    onDisconnect?: (user: User | null) => void
    onError?: (error: Error) => void
  }

  // Add PrivyClientConfig interface with Base-specific chains
  export interface PrivyClientConfig {
    loginMethods: Array<'email' | 'wallet'>
    appearance: {
      theme: 'light' | 'dark'
      accentColor: string
    }
    supportedChains: Chain[]
    walletConnectProjectId: string
    defaultChain?: Chain
  }

  // Main Privy interface - defines what methods/properties are available
  export interface PrivyInterface {
    ready: boolean
    authenticated: boolean
    user: User | null
    login: () => Promise<void>
    logout: () => Promise<void>
    createWallet: () => Promise<void>
    linkWallet: () => Promise<void>
    unlinkWallet: (address: string) => Promise<void>
    connectWallet: () => Promise<void>
    exportWallet: () => Promise<void>
  }

  // Wallet data structure that Privy returns
  export interface WalletData {
    address: `0x${string}`
    chainId: 8453 | 84532 // Base mainnet or Base Sepolia
    connector: 'embedded' | 'injected' | 'walletconnect'
  }

  // User interface - what we get from Privy about the user
  export interface User {
    id: string
    email?: {
      address: string
      verified: boolean
    }
    wallet?: WalletData
    createdAt: Date
    linkedAccounts: WalletData[]
  }

  // Hook return types
  export interface UsePrivyReturn extends PrivyInterface {
    user: User | null
    ready: boolean
    authenticated: boolean
  }

  // Export the hooks and components
  export function usePrivy(): UsePrivyReturn
  export const PrivyProvider: (props: PrivyProviderProps) => JSX.Element
}
