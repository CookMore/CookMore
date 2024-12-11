'use client'

import { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { BasePanel } from './BasePanel'
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { useRouter } from 'next/navigation'
import { CHAIN_IDS } from '@/lib/web3/config'
import { toast } from 'sonner'

export function ConnectedPanel() {
  const { user, ready, logout } = usePrivy()
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const router = useRouter()
  const [showCopyTooltip, setShowCopyTooltip] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleDisconnect = async () => {
    try {
      disconnect()
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Disconnect error:', error)
      toast.error('Failed to disconnect wallet')
    }
  }

  const handleCopy = async (address: string | undefined) => {
    if (!address) return
    await navigator.clipboard.writeText(address)
    setShowCopyTooltip(true)
    setTimeout(() => setShowCopyTooltip(false), 2000)
  }

  const handleConnectCoinbase = async () => {
    try {
      const coinbaseConnector = connectors.find(c => c.name === 'Coinbase Wallet')
      if (coinbaseConnector) {
        await connect({ connector: coinbaseConnector })
      }
    } catch (error) {
      console.error('Coinbase connection error:', error)
      toast.error('Failed to connect Coinbase Wallet')
    }
  }

  if (!mounted || !ready || !user) {
    return (
      <BasePanel title='Connection'>
        <div className='flex items-center justify-center min-h-[200px]'>
          <div className='text-github-fg-muted'>Loading...</div>
        </div>
      </BasePanel>
    )
  }

  const displayAddress = address || user.wallet?.address
  const shortAddress = displayAddress
    ? `${displayAddress.slice(0, 6)}...${displayAddress.slice(-4)}`
    : null

  const networkName = chainId === CHAIN_IDS.BASE_MAINNET ? 'Base' : 'Base Sepolia'

  return (
    <BasePanel title='Connection'>
      <div className='space-y-6'>
        {/* Wallet Info */}
        <div className='p-4 bg-github-canvas-default rounded-lg border border-github-border-default transition-all hover:border-github-border-muted'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-github-fg-default font-medium'>Wallet</h3>
            <span className='px-2 py-1 text-xs bg-github-success-emphasis text-github-fg-onEmphasis rounded-full animate-pulse'>
              {isConnected ? 'Connected' : 'Not Connected'}
            </span>
          </div>

          {/* Address */}
          {shortAddress && (
            <div className='flex items-center space-x-2 relative'>
              <span className='text-github-fg-muted text-sm font-mono'>{shortAddress}</span>
              <button
                onClick={() => handleCopy(displayAddress)}
                className='text-github-accent-fg hover:text-github-accent-emphasis text-sm transition-colors'
              >
                Copy
              </button>
              {showCopyTooltip && (
                <span className='absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-github-canvas-overlay text-github-fg-default rounded shadow-lg animate-fadeIn'>
                  Copied!
                </span>
              )}
            </div>
          )}

          {/* Wallet Options */}
          <div className='mt-4 space-y-2'>
            {!isConnected && (
              <button
                onClick={handleConnectCoinbase}
                disabled={isPending}
                className='w-full px-4 py-2 text-sm font-medium text-github-fg-default border border-github-border-default rounded-md hover:bg-github-canvas-subtle transition-colors disabled:opacity-50'
              >
                {isPending ? 'Connecting...' : 'Connect Coinbase Wallet'}
              </button>
            )}
            
            <button
              onClick={handleDisconnect}
              className='w-full px-4 py-2 text-sm font-medium text-github-danger-fg border border-github-danger-emphasis rounded-md hover:bg-github-danger-subtle transition-colors'
            >
              Disconnect Wallet
            </button>
          </div>
        </div>

        {/* Network Info */}
        <div className='p-4 bg-github-canvas-default rounded-lg border border-github-border-default'>
          <h3 className='text-github-fg-default font-medium mb-3'>Network</h3>
          <div className='flex items-center space-x-2'>
            <div className='w-2 h-2 bg-github-success-emphasis rounded-full animate-pulse' />
            <span className='text-github-fg-default text-sm'>{networkName}</span>
          </div>
        </div>
      </div>
    </BasePanel>
  )
}
