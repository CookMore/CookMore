'use client'

import { ReactNode, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const DynamicPrivyProvider = dynamic(() => import('./privy-provider'), {
  ssr: false,
  loading: () => <div>Loading authentication...</div>,
})

interface Props {
  children: ReactNode
  appId: string
}

export function PrivyWrapper({ children, appId }: Props) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Wait for window to be defined and Privy to be loaded
    if (typeof window !== 'undefined') {
      const checkPrivy = () => {
        if (window._privyProvider) {
          setIsReady(true)
        } else {
          setTimeout(checkPrivy, 100)
        }
      }
      checkPrivy()
    }
  }, [])

  if (!isReady) {
    return <div>Initializing authentication...</div>
  }

  return <DynamicPrivyProvider appId={appId}>{children}</DynamicPrivyProvider>
}
