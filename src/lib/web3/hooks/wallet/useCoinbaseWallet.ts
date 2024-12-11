'use client'

import { useCallback } from 'react'
import { useConnect, useDisconnect } from 'wagmi'
import { toast } from 'sonner'

export function useCoinbaseWallet() {
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const connectWallet = useCallback(async () => {
    try {
      const coinbaseConnector = connectors.find(c => c.name === 'Coinbase Wallet')
      if (coinbaseConnector) {
        await connect({ connector: coinbaseConnector })
        toast.success('Coinbase Wallet connected successfully')
      } else {
        throw new Error('Coinbase Wallet connector not found')
      }
    } catch (error) {
      console.error('Coinbase Wallet connection error:', error)
      toast.error('Failed to connect Coinbase Wallet')
      throw error
    }
  }, [connect, connectors])

  const disconnectWallet = useCallback(async () => {
    try {
      await disconnect()
      toast.success('Coinbase Wallet disconnected successfully')
    } catch (error) {
      console.error('Coinbase Wallet disconnect error:', error)
      toast.error('Failed to disconnect Coinbase Wallet')
      throw error
    }
  }, [disconnect])

  return {
    connectWallet,
    disconnectWallet,
    isPending,
  }
}
