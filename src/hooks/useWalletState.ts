'use client'

import { useEffect, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'

export function useWalletState() {
  const { user, ready } = usePrivy()
  const [address, setAddress] = useState<string | null>(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const [loading, setLoading] = useState(true)

  // Get the connected wallet address
  useEffect(() => {
    if (ready && user?.wallet?.address) {
      setAddress(user.wallet.address)
    } else {
      setAddress(null)
    }
  }, [ready, user?.wallet?.address])

  // Check if we're on the correct network
  useEffect(() => {
    const checkNetwork = async () => {
      if (!user?.wallet) {
        setIsCorrectNetwork(false)
        setLoading(false)
        return
      }

      try {
        // Get the chain ID directly from the wallet
        const chainId = await user.wallet.chainId

        // Check if we're on Base Sepolia (chain ID 84532)
        const isBase = chainId === '84532'

        setIsCorrectNetwork(isBase)
        setLoading(false)
      } catch (error) {
        console.error('Network check failed:', error)
        setIsCorrectNetwork(false)
        setLoading(false)
      }
    }

    if (ready) {
      checkNetwork()
    }
  }, [ready, user?.wallet])

  return {
    address,
    isCorrectNetwork,
    loading,
    wallet: user?.wallet || null,
    ready,
  }
}
