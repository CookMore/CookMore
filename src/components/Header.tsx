'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth/hooks/useAuth'
import { ROUTES } from '@/lib/routes'
import { AuthButton } from '@/components/AuthButton'
import { NavigationLinks } from '@/components/NavigationLinks'
import { TierBadge } from '@/components/ui/TierBadge'
import { useNFTTiers } from '@/lib/web3/hooks/useNFTTiers'
import { ProfileTier } from '@/types/profile'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function Header() {
  const { isAuthenticated, profile, ready } = useAuth()
  const { hasGroup, hasPro } = useNFTTiers()
  const currentTier = hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE

  return (
    <header className='sticky top-0 z-50 border-b border-github-border-default bg-github-canvas-default'>
      <nav className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center space-x-8'>
          <Link
            href={isAuthenticated ? ROUTES.AUTH.KITCHEN.HOME : ROUTES.MARKETING.HOME}
            className='text-xl font-bold text-github-fg-default hover:text-github-fg-muted'
          >
            CookMore
          </Link>
          {ready && <NavigationLinks authenticated={isAuthenticated} hasProfile={!!profile} />}
        </div>

        <div className='flex items-center space-x-4'>
          {ready && isAuthenticated && (
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
