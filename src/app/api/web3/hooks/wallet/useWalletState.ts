'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { usePrivy } from '@privy-io/react-auth'
import { chainIds } from '@/lib/web3/config/chains'
import { toast } from 'sonner'

export interface WalletHookResult {
  isReady: boolean
  isConnected: boolean
  isMainnet: boolean
  isPending: boolean
  chainId: number
  address?: string
  user?: any
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

export function useWalletState(): WalletHookResult {
  const { user, ready: privyReady, logout } = usePrivy()
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isReady = mounted && privyReady
  const isMainnet = chainId === chainIds.BASE_MAINNET
  const activeAddress = address || user?.wallet?.address

  const handleConnect = useCallback(async () => {
    try {
      const coinbaseConnector = connectors.find(c => c.name === 'Coinbase Wallet')
      if (coinbaseConnector) {
        await connect({ connector: coinbaseConnector })
        toast.success('Wallet connected successfully')
      } else {
        throw new Error('Coinbase Wallet connector not found')
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      toast.error('Failed to connect wallet')
      throw error
    }
  }, [connect, connectors])

  const handleDisconnect = useCallback(async () => {
    try {
      disconnect()
      await logout()
      toast.success('Wallet disconnected successfully')
    } catch (error) {
      console.error('Wallet disconnect error:', error)
      toast.error('Failed to disconnect wallet')
      throw error
    }
  }, [disconnect, logout])

  return {
    // State
    isReady,
    isConnected,
    isMainnet,
    isPending,
    chainId,
    address: activeAddress,
    user,

    // Actions
    connect: handleConnect,
    disconnect: handleDisconnect,
  }
}
