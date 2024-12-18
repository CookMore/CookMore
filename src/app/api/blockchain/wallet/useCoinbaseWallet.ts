'use client'

import { useCallback } from 'react'
import { useConnect, useDisconnect } from 'wagmi'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function useCoinbaseWallet() {
  const t = useTranslations('wallet')
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const connectWallet = useCallback(async () => {
    try {
      const coinbaseConnector = connectors.find((c) => c.name === 'Coinbase Wallet')
      if (coinbaseConnector) {
        await connect({ connector: coinbaseConnector })
        toast.success(t('connect.success'))
      } else {
        throw new Error(t('connect.noConnector'))
      }
    } catch (error) {
      console.error('Coinbase Wallet connection error:', error)
      toast.error(t('connect.error'))
      throw error
    }
  }, [connect, connectors, t])

  const disconnectWallet = useCallback(async () => {
    try {
      await disconnect()
      toast.success(t('disconnect.success'))
    } catch (error) {
      console.error('Coinbase Wallet disconnect error:', error)
      toast.error(t('disconnect.error'))
      throw error
    }
  }, [disconnect, t])

  return {
    connectWallet,
    disconnectWallet,
    isPending,
  }
}
