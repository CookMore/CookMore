'use client'

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
import { Suspense } from 'react'

function AuthenticatedHeader() {
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

function HeaderContent() {
  const pathname = usePathname()

  // Only show on authenticated routes
  const isAuthenticatedRoute = pathname?.includes('(authenticated)')
  if (!isAuthenticatedRoute) return null

  return <AuthenticatedHeader />
}

export function Header() {
  return (
    <Suspense fallback={null}>
      <HeaderContent />
    </Suspense>
  )
}
