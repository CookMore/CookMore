import { User } from '@privy-io/react-auth'

declare module '@privy-io/react-auth' {
  // Main Privy interface - defines what methods/properties are available
  export interface PrivyInterface {
    ready: boolean // Whether Privy is ready to use
    authenticated: boolean // Whether user is authenticated
    user: User | null // Current user or null if not logged in
    login: () => Promise<void> // Login method
    createWallet: () => Promise<void> // Create new embedded wallet
    linkWallet: () => Promise<void> // Link external wallet
    unlinkWallet: () => Promise<void> // Unlink wallet
    connectWallet: () => Promise<void> // Connect to wallet
    exportWallet: () => Promise<void> // Export wallet credentials
  }

  // Wallet data structure that Privy returns
  interface WalletData {
    address: `0x${string}` // Ethereum address with 0x prefix
    chainId: number // Chain ID (e.g., 1 for Ethereum mainnet)
    connector: 'embedded' | 'injected' | 'walletconnect' // Wallet connection type
  }

  // OAuth provider data (Google/GitHub)
  interface ProviderData {
    email?: string // Provider email if available
    name?: string // Provider name if available
    picture?: string // Profile picture URL if available
    sub: string // OAuth subject identifier
  }

  // User interface - what we get from Privy about the user
  export interface User {
    id: string // Privy user ID
    email?: {
      // Email data if provided
      address: string // Email address
      verified: boolean // Whether email is verified
      profileImage?: string // Profile image URL
    }
    wallet?: WalletData // Connected wallet data
    google?: ProviderData // Google OAuth data if connected
    github?: ProviderData // GitHub OAuth data if connected
    createdAt: Date // Account creation date
    linkedAccounts: WalletData[] // Array of linked wallets
  }
}
