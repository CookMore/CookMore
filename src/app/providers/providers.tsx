'use client'

import { Suspense } from 'react'
import { ServiceWorkerProvider } from '@/app/providers/ServiceWorkerProvider'

function LoadingSpinner() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-github-accent-emphasis' />
    </div>
  )
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ServiceWorkerProvider>
      <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
    </ServiceWorkerProvider>
  )
}
