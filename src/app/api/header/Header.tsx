'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { ROUTES } from '@/app/api/routes/routes'
import { NavigationLinks } from '@/app/api/navigation/NavigationLinks'
import { TierBadge } from '@/app/[locale]/(authenticated)/tier/components/TierBadge'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { cn } from '@/app/api/utils/utils'
import { LoadingSkeleton } from '@/app/api/loading/LoadingSkeleton'
import { MobileMenu } from './MobileMenu'
import { MarketingAuthButton } from './marketing/MarketingAuthButton'

function HeaderContent() {
  const { isAuthenticated, hasProfile, isLoading: authLoading } = useAuth()
  const { hasGroup, hasPro, isLoading: tiersLoading } = useNFTTiers()
  const currentTier = hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE

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
                    ? hasProfile
                      ? ROUTES.AUTH.PROFILE.HOME
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
              <NavigationLinks authenticated={isAuthenticated} hasProfile={hasProfile} />
            </div>

            {/* Right Section */}
            <div className='flex items-center space-x-4'>
              {/* Tier Badge */}
              {isAuthenticated && !tiersLoading && (
                <Link href={ROUTES.AUTH.TIER} className='hidden sm:block'>
                  <TierBadge tier={currentTier} size='sm' hasProfile={hasProfile} />
                </Link>
              )}
              {isAuthenticated && tiersLoading && (
                <div className='hidden sm:block'>
                  <LoadingSkeleton className='h-6 w-20' />
                </div>
              )}

              {/* Auth Button */}
              <div className='hidden lg:block'>
                <MarketingAuthButton />
              </div>

              {/* Mobile Menu */}
              <MobileMenu authenticated={isAuthenticated} hasProfile={hasProfile}>
                {isAuthenticated && !tiersLoading && (
                  <Link href={ROUTES.AUTH.TIER} className='block sm:hidden'>
                    <TierBadge tier={currentTier} size='sm' hasProfile={hasProfile} />
                  </Link>
                )}
                {isAuthenticated && tiersLoading && (
                  <div className='block sm:hidden'>
                    <LoadingSkeleton className='h-6 w-20' />
                  </div>
                )}
                <div className='lg:hidden'>
                  <MarketingAuthButton />
                </div>
              </MobileMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export function Header() {
  const { ready } = useAuth()

  if (!ready) {
    return <LoadingSkeleton className='h-16' />
  }

  return <HeaderContent />
}
