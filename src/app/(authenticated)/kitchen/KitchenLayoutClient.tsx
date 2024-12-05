'use client'

import { usePrivy } from '@privy-io/react-auth'

export function KitchenLayoutClient({ children }: { children: React.ReactNode }) {
  const { ready } = usePrivy()

  if (!ready) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-github-fg-muted'>Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}
