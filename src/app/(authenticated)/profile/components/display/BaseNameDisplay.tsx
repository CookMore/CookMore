'use client'

import React from 'react'

interface BaseNameDisplayProps {
  address: `0x${string}` | undefined
  showAvatar?: boolean
  showAddress?: boolean
  className?: string
}

export function BaseNameDisplay({
  address,
  showAvatar = true,
  showAddress = false,
  className = '',
}: BaseNameDisplayProps) {
  if (!address) return null

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showAvatar && <div className='w-8 h-8 rounded-full bg-github-canvas-subtle' />}
      <div className='flex flex-col'>
        <span className='text-github-fg-default font-medium'>
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        {showAddress && <span className='text-xs text-github-fg-muted'>{address}</span>}
      </div>
    </div>
  )
}
