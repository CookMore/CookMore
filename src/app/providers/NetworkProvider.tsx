'use client'

import { WagmiConfig } from 'wagmi'
import { useEffect, useState } from 'react'
import { config } from '@/lib/wagmi'

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state while hydrating
  if (!mounted) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-github-success-emphasis mb-4 mx-auto'></div>
          <p className='text-github-fg-muted mb-2'>Connecting to network...</p>
        </div>
      </div>
    )
  }

  return <WagmiConfig config={config}>{children}</WagmiConfig>
}
