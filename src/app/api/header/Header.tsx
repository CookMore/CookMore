'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { ROUTES } from '@/app/api/routes/routes'
import { AuthButton } from '@/app/api/auth/AuthButton'
import { NavigationLinks } from '@/app/api/navigation/NavigationLinks'
import { TierBadge } from '@/app/[locale]/(authenticated)/tier/components/TierBadge'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { cn } from '@/app/api/utils/utils'
import { LoadingSkeleton } from '@/app/api/loading/LoadingSkeleton'
import { MobileMenu } from './MobileMenu'

function AuthenticatedHeader() {
  const { isAuthenticated, profile, ready } = useAuth()
  const { hasGroup, hasPro } = useNFTTiers()
  const currentTier = hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE
  const pathname = usePathname()

  if (!ready) {
    return <LoadingSkeleton className='h-16' />
  }

  if (!isAuthenticated && pathname?.includes('(authenticated)')) {
    return <LoadingSkeleton className='h-16' />
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b border-github-border-default bg-github-canvas-default backdrop-blur supports-[backdrop-filter]:bg-github-canvas-default/80'>
      <div className='w-full'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='h-16 flex items-center justify-between max-w-[1400px] mx-auto'>
            {/* Logo Section */}
            <div className='flex-shrink-0'>
              <Link
                href={
                  isAuthenticated
                    ? profile
                      ? ROUTES.AUTH.KITCHEN.HOME
                      : ROUTES.AUTH.PROFILE.CREATE
                    : ROUTES.MARKETING.HOME
                }
                className='text-xl font-bold text-github-fg-default hover:text-github-fg-muted transition-colors'
              >
                CookMore
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden lg:flex lg:flex-1 lg:justify-center lg:px-8'>
              <NavigationLinks authenticated={isAuthenticated} hasProfile={!!profile} />
            </div>

            {/* Right Section */}
            <div className='flex items-center space-x-4'>
              {/* Tier Badge */}
              {isAuthenticated && profile && (
                <Link href={ROUTES.AUTH.TIER} className='hidden sm:block'>
                  <TierBadge tier={currentTier} size='sm' hasProfile={!!profile} />
                </Link>
              )}

              {/* Auth Button - Desktop */}
              <div className='hidden lg:block'>
                <AuthButton />
              </div>

              {/* Mobile Menu */}
              <MobileMenu authenticated={isAuthenticated} hasProfile={!!profile}>
                {isAuthenticated && profile && (
                  <Link href={ROUTES.AUTH.TIER} className='block sm:hidden'>
                    <TierBadge tier={currentTier} size='sm' hasProfile={!!profile} />
                  </Link>
                )}
                <div className='lg:hidden'>
                  <AuthButton />
                </div>
              </MobileMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function MarketingHeader() {
  const { isAuthenticated, profile, ready } = useAuth()
  const pathname = usePathname()

  if (!ready) {
    return <LoadingSkeleton className='h-16' />
  }

  if (isAuthenticated && !pathname?.includes('(marketing)')) {
    return <LoadingSkeleton className='h-16' />
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b border-github-border-default bg-github-canvas-default backdrop-blur supports-[backdrop-filter]:bg-github-canvas-default/80'>
      <div className='w-full'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='h-16 flex items-center justify-between max-w-[1400px] mx-auto'>
            {/* Logo */}
            <div className='flex-shrink-0'>
              <Link
                href={ROUTES.MARKETING.HOME}
                className='text-xl font-bold text-github-fg-default hover:text-github-fg-muted transition-colors'
              >
                CookMore
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden lg:flex lg:flex-1 lg:justify-center lg:px-8'>
              <NavigationLinks authenticated={isAuthenticated} hasProfile={!!profile} />
            </div>

            {/* Right Section */}
            <div className='flex items-center space-x-4'>
              {/* Auth Button - Desktop */}
              <div className='hidden lg:block'>
                <AuthButton />
              </div>

              {/* Mobile Menu */}
              <MobileMenu authenticated={isAuthenticated} hasProfile={!!profile}>
                <div className='lg:hidden'>
                  <AuthButton />
                </div>
              </MobileMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function HeaderContent() {
  const pathname = usePathname()
  const { isAuthenticated, ready } = useAuth()

  if (!ready) {
    return <LoadingSkeleton className='h-16' />
  }

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
