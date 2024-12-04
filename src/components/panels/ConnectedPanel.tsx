'use client'

import { usePrivy } from '@privy-io/react-auth'
import { BasePanel } from './BasePanel'
import { useState } from 'react'

export function ConnectedPanel() {
  const { user, logout, ready } = usePrivy()
  const [showCopyTooltip, setShowCopyTooltip] = useState(false)

  const handleCopy = async (address: string) => {
    await navigator.clipboard.writeText(address)
    setShowCopyTooltip(true)
    setTimeout(() => setShowCopyTooltip(false), 2000)
  }

  if (!ready || !user) return null

  const walletAddress = user.wallet?.address
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null

  return (
    <BasePanel title='Connection'>
      <div className='space-y-6 animate-fadeIn'>
        {/* Wallet Info */}
        <div className='p-4 bg-github-canvas-default rounded-lg border border-github-border-default transition-all hover:border-github-border-muted'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-github-fg-default font-medium'>Wallet</h3>
            <span className='px-2 py-1 text-xs bg-github-success-emphasis text-github-fg-onEmphasis rounded-full animate-pulse'>
              Connected
            </span>
          </div>

          {/* ENS or Address */}
          <div className='space-y-2 mb-4'>
            {shortAddress && (
              <div className='flex items-center space-x-2 relative'>
                <span className='text-github-fg-muted text-sm font-mono'>{shortAddress}</span>
                <button
                  onClick={() => handleCopy(walletAddress)}
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
          </div>
        </div>

        {/* Network Selector */}
        <div className='p-4 bg-github-canvas-default rounded-lg border border-github-border-default'>
          <h3 className='text-github-fg-default font-medium mb-4'>Network</h3>
          <select
            className='w-full bg-github-canvas-subtle border border-github-border-default rounded-md p-2 text-sm text-github-fg-default'
            value={user.wallet?.chainId || '1'}
            onChange={(e) => {
              // Handle network switch
              console.log('Switch to network:', e.target.value)
            }}
          >
            <option value='1'>Ethereum Mainnet</option>
            <option value='137'>Polygon</option>
            <option value='42161'>Arbitrum</option>
            <option value='10'>Optimism</option>
          </select>
        </div>

        {/* Connection Details */}
        <div className='p-4 bg-github-canvas-default rounded-lg border border-github-border-default'>
          <h3 className='text-github-fg-default font-medium mb-2'>Connected with</h3>
          {user.email && (
            <div className='text-sm text-github-fg-muted flex items-center space-x-2'>
              <svg className='w-4 h-4' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' />
              </svg>
              <span>{user.email}</span>
            </div>
          )}
        </div>

        {/* Disconnect Button */}
        <button
          onClick={() => {
            if (confirm('Are you sure you want to disconnect?')) {
              logout()
            }
          }}
          className='w-full px-4 py-2 text-sm text-github-danger-fg border border-github-danger-emphasis rounded-md hover:bg-github-danger-subtle transition-all duration-200 hover:scale-105 active:scale-95'
        >
          Disconnect Wallet
        </button>
      </div>
    </BasePanel>
  )
}
