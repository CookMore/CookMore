import React from 'react'
import { cn } from '@/app/api/utils/utils'
import type { RecipeMintStatus } from '@/app/[locale]/(authenticated)/recipe/services/client/recipe.contract.service'
import {
  IconLoader,
  IconCheck,
  IconAlertTriangle,
  IconWallet,
  IconCurrencyEthereum,
} from '@/app/api/icons/index'

export function RecipeMintStatus({ status }: { status: RecipeMintStatus }) {
  const getStatusIcon = () => {
    switch (status.status) {
      case 'preparing':
        return <IconWallet className='w-8 h-8 text-github-accent-fg animate-pulse' />
      case 'minting':
        return <IconLoader className='w-8 h-8 text-github-accent-fg animate-spin' />
      case 'completed':
        return <IconCheck className='w-8 h-8 text-green-500' />
      case 'failed':
        return <IconAlertTriangle className='w-8 h-8 text-red-500' />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case 'preparing':
      case 'minting':
        return 'text-github-accent-fg'
      case 'completed':
        return 'text-green-500'
      case 'failed':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className={cn('flex items-center space-x-2', getStatusColor())}>
      {getStatusIcon()}
      <span>{status.message}</span>
    </div>
  )
}
