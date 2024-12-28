'use client'

import React from 'react'
import { cn } from '@/app/api/utils/utils'
import type { MintStatus } from '../../services/client/contract.service'
import {
  IconLoader,
  IconCheck,
  IconAlertTriangle,
  IconWallet,
  IconCurrencyEthereum,
} from '@/app/api/icons/index'

export function MintingStatus({ status }: { status: MintStatus }) {
  const getStatusIcon = () => {
    switch (status.status) {
      case 'preparing':
        return <IconWallet className='w-8 h-8 text-github-accent-fg animate-pulse' />
      case 'minting':
        return <IconLoader className='w-8 h-8 text-github-accent-fg animate-spin' />
      case 'confirming':
        return <IconCurrencyEthereum className='w-8 h-8 text-github-accent-fg animate-bounce' />
      case 'complete':
        return <IconCheck className='w-8 h-8 text-github-done-fg' />
      case 'error':
        return <IconAlertTriangle className='w-8 h-8 text-github-danger-fg' />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case 'complete':
        return 'text-github-done-fg'
      case 'error':
        return 'text-github-danger-fg'
      default:
        return 'text-github-accent-fg'
    }
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
      <div className='bg-github-canvas-default rounded-lg p-8 max-w-md w-full mx-4 shadow-xl'>
        <div className='text-center'>
          <div className='mb-4'>{getStatusIcon()}</div>
          <h3 className={cn('text-xl font-semibold mb-2', getStatusColor())}>{status.message}</h3>

          {status.txHash && (
            <div className='mt-4 text-sm'>
              <p className='text-github-fg-muted'>Transaction Hash:</p>
              <a
                href={`https://etherscan.io/tx/${status.txHash}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-github-accent-fg hover:text-github-accent-emphasis break-all'
              >
                {status.txHash}
              </a>
            </div>
          )}

          {status.tokenId && (
            <div className='mt-4 text-sm'>
              <p className='text-github-fg-muted'>Token ID:</p>
              <p className='text-github-fg-default font-mono'>{status.tokenId}</p>
            </div>
          )}

          {status.status === 'error' && (
            <button
              onClick={() => window.location.reload()}
              className='mt-4 px-4 py-2 bg-github-danger-fg text-white rounded hover:bg-github-danger-emphasis'
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
