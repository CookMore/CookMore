import { useAccount, useChainId, useWalletClient } from 'wagmi'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { baseSepolia } from 'viem/chains'

export function useWalletState() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: walletClient } = useWalletClient()
  const [isReady, setIsReady] = useState(false)

  // Check if connected to Base Sepolia
  const isChainSupported = chainId === baseSepolia.id

  // Check wallet readiness
  useEffect(() => {
    if (isConnected && walletClient && isChainSupported) {
      setIsReady(true)
    } else {
      setIsReady(false)
    }
  }, [isConnected, walletClient, isChainSupported])

  // Handle connection errors
  const handleConnectionError = useCallback((error: Error) => {
    console.error('Wallet connection error:', error)
    toast.error('Failed to connect wallet')
  }, [])

  return {
    address,
    isConnected,
    isReady,
    isChainSupported,
    chainId,
    walletClient,
    handleConnectionError,
  }
}
