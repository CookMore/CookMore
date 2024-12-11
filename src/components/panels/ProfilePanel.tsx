'use client'

import { useEffect, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { BasePanel } from './BasePanel'
import { DefaultAvatar } from '../ui/DefaultAvatar'
import { useAccount } from 'wagmi'

export function ProfilePanel() {
  const { user, ready } = usePrivy()
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !ready || !user) {
    return (
      <BasePanel title='Profile'>
        <div className='flex items-center justify-center min-h-[200px]'>
          <div className='text-github-fg-muted'>Loading...</div>
        </div>
      </BasePanel>
    )
  }

  // Get the active wallet address (either from Privy or Wagmi)
  const activeAddress = isWagmiConnected ? wagmiAddress : user.wallet?.address

  // Get the authentication method used
  const authMethod = user.linkedAccounts?.find(
    account => account.type === 'email' || 
               account.type === 'google' || 
               account.type === 'apple' ||
               account.type === 'discord' ||
               account.type === 'twitter' ||
               account.type === 'farcaster'
  )

  return (
    <BasePanel title='Profile'>
      <div className='space-y-6'>
        {/* Avatar and Basic Info */}
        <div className='flex items-center space-x-4'>
          <DefaultAvatar size={64} address={activeAddress || ''} />
          <div>
            <h3 className='text-github-fg-default font-medium'>
              {user.email || 'Anonymous User'}
            </h3>
            <p className='text-sm text-github-fg-muted'>
              {authMethod ? `Authenticated via ${authMethod.type}` : 'No authentication method'}
            </p>
          </div>
        </div>

        {/* Wallet Info */}
        {activeAddress && (
          <div className='p-4 bg-github-canvas-default rounded-lg border border-github-border-default'>
            <h4 className='text-sm font-medium text-github-fg-default mb-2'>Wallet Address</h4>
            <p className='text-xs font-mono text-github-fg-muted break-all'>{activeAddress}</p>
          </div>
        )}

        {/* Authentication Method */}
        <div className='p-4 bg-github-canvas-default rounded-lg border border-github-border-default'>
          <h4 className='text-sm font-medium text-github-fg-default mb-2'>Authentication</h4>
          <div className='space-y-2'>
            {user.linkedAccounts?.map((account, index) => (
              <div key={index} className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-github-success-emphasis rounded-full' />
                <span className='text-sm text-github-fg-muted capitalize'>{account.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BasePanel>
  )
}
