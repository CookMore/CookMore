'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { MarketingHeader } from './marketing/MarketingHeader'
import { ErrorBoundaryWrapper } from '@/app/api/error/ErrorBoundaryWrapper'
import { Suspense } from 'react'
import { LoadingSkeleton } from '@/app/api/loading/LoadingSkeleton'
import { ROUTES } from '@/app/api/routes/routes'
import { ProfileEdgeProvider } from '@/app/[locale]/(authenticated)/profile/providers/edge/ProfileEdgeProvider'
import { usePrivy } from '@privy-io/react-auth'

export function HeaderWrapper() {
  const pathname = usePathname()
  const { user } = usePrivy()

  // Determine if the user is authenticated
  const isAuthenticated = !!user

  // Get the wallet address from the user data
  const address = user?.wallet?.address || ''

  console.log('Current Pathname:', pathname) // Log the current pathname
  console.log('User Address:', address) // Log the user address

  return (
    <ErrorBoundaryWrapper name='header'>
      <Suspense fallback={<LoadingSkeleton className='h-16' />}>
        {isAuthenticated ? (
          <ProfileEdgeProvider address={address}>
            <Header showAuthButton={true} />
          </ProfileEdgeProvider>
        ) : (
          <MarketingHeader showAuthButton={true} />
        )}
      </Suspense>
    </ErrorBoundaryWrapper>
  )
}
