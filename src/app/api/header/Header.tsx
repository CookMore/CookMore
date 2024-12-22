'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { ROUTES } from '@/app/api/routes/routes'
import { NavigationLinks } from '@/app/api/navigation/NavigationLinks'
import { TierBadge } from '@/app/[locale]/(authenticated)/tier/components/TierBadge'
import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { LoadingSkeleton } from '@/app/api/loading/LoadingSkeleton'
import { MobileMenu } from './MobileMenu'
import { MarketingAuthButton } from './marketing/MarketingAuthButton'
import { AdminButton } from '@/app/[locale]/(authenticated)/admin/components/AdminButton'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, hasProfile } = useAuth()
  const { hasGroup, hasPro, isLoading: tiersLoading } = useNFTTiers()
  const currentTier = hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE

  return (
    <header className='sticky top-0 z-40 w-full border-b border-github-border-default bg-github-canvas-default'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center'>
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

          <div className='hidden lg:block'>
            <NavigationLinks />
          </div>

          <div className='flex items-center space-x-4'>
            {/* Mobile Menu Button */}
            <button
              type='button'
              className='lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-github-fg-default hover:text-github-fg-muted transition-colors'
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className='sr-only'>Open main menu</span>
              <svg
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            </button>

            {/* Admin Button */}
            <div className='hidden sm:block'>
              <AdminButton />
            </div>

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
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
        <div className='block sm:hidden'>
          <AdminButton />
        </div>
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
    </header>
  )
}
