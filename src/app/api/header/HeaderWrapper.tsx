'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Header } from './Header'
import { MarketingHeader } from './marketing/MarketingHeader'
import { ErrorBoundaryWrapper } from '@/app/api/error/ErrorBoundaryWrapper'
import { Suspense, useEffect } from 'react'
import { LoadingSkeleton } from '@/app/api/loading/LoadingSkeleton'
import { ROUTES } from '@/app/api/routes/routes'
import { ProfileEdgeProvider } from '@/app/[locale]/(authenticated)/profile/providers/edge/ProfileEdgeProvider'
import { usePrivy } from '@privy-io/react-auth'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { TimerProvider } from '@/app/api/components/widgets/TimerContext'

export function HeaderWrapper() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = usePrivy()
  const { isAuthenticated, hasProfile } = useAuth()

  const address = user?.wallet?.address || ''

  console.log('Current Pathname:', pathname)
  console.log('User Address:', address)

  useEffect(() => {
    const isFirstLogin = sessionStorage.getItem('isFirstLogin')

    if (isAuthenticated && isFirstLogin) {
      console.log('User is authenticated:', { isAuthenticated, hasProfile })
      if (hasProfile) {
        console.log('Redirecting to Kitchen')
        router.push(ROUTES.AUTH.KITCHEN)
      } else {
        console.log('Redirecting to Create Profile')
        router.push(ROUTES.AUTH.PROFILE.CREATE)
      }
      sessionStorage.removeItem('isFirstLogin') // Clear the flag after redirect
    }
  }, [isAuthenticated, hasProfile, router])

  return (
    <ErrorBoundaryWrapper name='header'>
      <Suspense fallback={<LoadingSkeleton className='h-16' />}>
        {isAuthenticated ? (
          <ProfileEdgeProvider address={address}>
            <TimerProvider>
              <Header showAuthButton={true} />
            </TimerProvider>
          </ProfileEdgeProvider>
        ) : (
          <MarketingHeader showAuthButton={true} />
        )}
      </Suspense>
    </ErrorBoundaryWrapper>
  )
}
