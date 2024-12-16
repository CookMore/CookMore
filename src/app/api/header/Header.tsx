'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { ROUTES } from '@/app/api/routes/routes'
import { AuthButton } from '@/app/api/auth/AuthButton'
import { NavigationLinks } from '@/app/api/navigation/NavigationLinks'
import { TierBadge } from '@/app/[locale]/(authenticated)/tier/components/TierBadge'
import { useNFTTiers } from '@/app/api/web3/tier'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { cn } from '@/app/api/utils/utils'
import { ThemeToggle } from '@/app/api/components/ui/ThemeToggle'
import { LoadingSkeleton } from '@/app/api/loading/LoadingSkeleton'

function AuthenticatedHeader() {
  const { isAuthenticated, profile, ready } = useAuth()
  const { hasGroup, hasPro } = useNFTTiers()
  const currentTier = hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE
  const pathname = usePathname()

  console.log('Auth Debug:', { isAuthenticated, hasProfile: !!profile, ready, pathname })

  if (!ready) {
    return <LoadingSkeleton className='h-16' />
  }

  // If not authenticated but on an auth route, show loading
  if (!isAuthenticated && pathname?.includes('(authenticated)')) {
    return <LoadingSkeleton className='h-16' />
  }

  return (
    <header className='sticky top-0 z-50 border-b border-github-border-default bg-github-canvas-default'>
      <nav className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center space-x-8'>
          <Link
            href={
              isAuthenticated
                ? profile
                  ? ROUTES.AUTH.KITCHEN.HOME
                  : ROUTES.AUTH.PROFILE.CREATE
                : ROUTES.MARKETING.HOME
            }
            className='text-xl font-bold text-github-fg-default hover:text-github-fg-muted'
          >
            CookMore
          </Link>
          <NavigationLinks authenticated={isAuthenticated} hasProfile={!!profile} />
        </div>

        <div className='flex items-center space-x-4'>
          {isAuthenticated && profile && (
            <Link href={ROUTES.AUTH.TIER}>
              <TierBadge tier={currentTier} size='sm' hasProfile={!!profile} />
            </Link>
          )}
          <ThemeToggle />
          <AuthButton />
        </div>
      </nav>
    </header>
  )
}

function MarketingHeader() {
  const { isAuthenticated, profile, ready } = useAuth()
  const pathname = usePathname()

  if (!ready) {
    return <LoadingSkeleton className='h-16' />
  }

  // If authenticated but on a marketing route, redirect will happen
  if (isAuthenticated && !pathname?.includes('(marketing)')) {
    return <LoadingSkeleton className='h-16' />
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b border-github-border-default bg-github-canvas-default'>
      <div className='container flex h-16 items-center'>
        <div className='mr-4'>
          <Link href={ROUTES.MARKETING.HOME} className='flex items-center space-x-2'>
            <span className='font-bold'>CookMore</span>
          </Link>
        </div>

        <nav className='flex flex-1'>
          <NavigationLinks authenticated={isAuthenticated} hasProfile={!!profile} />
        </nav>

        <div className='flex items-center space-x-4'>
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  )
}

function HeaderContent() {
  const pathname = usePathname()
  const { isAuthenticated, ready } = useAuth()

  // Show loading skeleton while auth is not ready
  if (!ready) {
    return <LoadingSkeleton className='h-16' />
  }

  // Show authenticated header if user is authenticated or on an auth route
  const shouldShowAuthHeader = isAuthenticated || pathname?.includes('(authenticated)')
  return shouldShowAuthHeader ? <AuthenticatedHeader /> : <MarketingHeader />
}

export function Header() {
  return (
    <Suspense fallback={<LoadingSkeleton className='h-16' />}>
      <HeaderContent />
    </Suspense>
  )
}
