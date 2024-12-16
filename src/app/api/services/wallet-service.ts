import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'
import { base, baseSepolia } from 'viem/chains'

// App configuration
const APP_NAME = process.env.NEXT_PUBLIC_COINBASE_APP_NAME || 'CookMore'
const APP_LOGO_URL = process.env.NEXT_PUBLIC_COINBASE_APP_LOGO_URL || '/icons/brand/base-logo-in-blue.svg'

// Chain configuration
const IS_MAINNET = process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
const CHAIN = IS_MAINNET ? base : baseSepolia
const RPC_URL = IS_MAINNET 
  ? process.env.NEXT_PUBLIC_BASE_RPC_URL 
  : process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL

class WalletService {
  private static instance: WalletService
  private coinbaseWallet: CoinbaseWalletSDK | null = null

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeCoinbaseWallet()
    }
  }

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService()
    }
    return WalletService.instance
  }

  private initializeCoinbaseWallet() {
    this.coinbaseWallet = new CoinbaseWalletSDK({
      appName: APP_NAME,
      appLogoUrl: APP_LOGO_URL,
      darkMode: true,
      chainId: CHAIN.id,
    })
  }

  getCoinbaseProvider() {
    if (!this.coinbaseWallet) {
      throw new Error('Coinbase Wallet not initialized')
    }
    return this.coinbaseWallet.makeWeb3Provider(RPC_URL, CHAIN.id)
  }

  async connectCoinbaseWallet() {
    const provider = this.getCoinbaseProvider()
    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' })
      return accounts[0]
    } catch (error) {
      console.error('Failed to connect Coinbase Wallet:', error)
      throw error
    }
  }

  async disconnectCoinbaseWallet() {
    const provider = this.getCoinbaseProvider()
    try {
      await provider.disconnect()
    } catch (error) {
      console.error('Failed to disconnect Coinbase Wallet:', error)
      throw error
    }
  }
}

export const walletService = WalletService.getInstance()
