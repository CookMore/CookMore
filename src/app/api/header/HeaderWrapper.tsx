'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { MarketingHeader } from './marketing/Header'
import { ErrorBoundaryWrapper } from '@/app/api/error/ErrorBoundaryWrapper'
import { Suspense } from 'react'
import { LoadingSkeleton } from '@/app/api/loading/LoadingSkeleton'

export function HeaderWrapper() {
  const pathname = usePathname()
  const isMarketingRoute = !pathname?.includes('(authenticated)')

  return (
    <ErrorBoundaryWrapper name='header'>
      <Suspense fallback={<LoadingSkeleton className='h-16' />}>
        {isMarketingRoute ? <MarketingHeader /> : <Header />}
      </Suspense>
    </ErrorBoundaryWrapper>
  )
}
