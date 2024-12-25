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
import { IconMenu } from '@/app/api/icons'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, hasProfile } = useAuth()
  const { hasGroup, hasPro, isLoading: tiersLoading } = useNFTTiers()
  const currentTier = hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE

  return (
    <header className='sticky top-0 z-[99] w-full border-b border-github-border-default bg-github-canvas-default'>
      <div className='flex h-16 items-center justify-between'>
        <div className='flex items-center pl-4'>
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

        <div className='hidden lg:block flex-1 px-4'>
          <NavigationLinks />
        </div>

        <div className='flex items-center space-x-4 pr-4'>
          <button
            type='button'
            className='lg:hidden inline-flex items-center justify-center rounded-md p-2 text-github-fg-default hover:text-github-fg-muted hover:bg-github-canvas-subtle transition-colors'
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className='sr-only'>Open main menu</span>
            <IconMenu className='h-6 w-6' />
          </button>

          <div className='hidden sm:block'>
            <AdminButton />
          </div>

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

          <div className='hidden lg:block'>
            <MarketingAuthButton />
          </div>
        </div>
      </div>

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
