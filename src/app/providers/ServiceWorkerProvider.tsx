'use client'

import { useEffect } from 'react'
import { register } from '@/app/pwa/serviceWorkerRegistration'

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    register({
      onSuccess: (registration) => {
        console.log('PWA successfully registered')
      },
      onUpdate: (registration) => {
        console.log('New version available')
      },
    })
  }, [])

  return <>{children}</>
}
