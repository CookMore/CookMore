'use client'

import { Link } from '@/app/api/navigation/Link'
import { usePathname } from '@/i18n'
import { ROUTES } from '@/app/api/routes/routes'
import { cn } from '@/app/api/utils/utils'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { useMemo } from 'react'

export function NavigationLinks() {
  const pathname = usePathname()
  const { isAuthenticated, hasProfile, isAdmin } = useAuth()

  // Memoize links to prevent unnecessary re-renders
  const links = useMemo(() => {
    // Define authenticated links with proper access control
    const authenticatedLinks = [
      { href: ROUTES.AUTH.KITCHEN.HOME, label: 'Kitchen', requiresProfile: true },
      { href: ROUTES.AUTH.EXPLORE, label: 'Explore', requiresProfile: true },
      { href: ROUTES.AUTH.CALENDAR, label: 'Calendar', requiresProfile: true },
      { href: ROUTES.AUTH.TIER, label: 'Tier', requiresProfile: true },
      ...(isAdmin
        ? [
            {
              href: ROUTES.AUTH.ADMIN,
              label: 'Admin',
              requiresProfile: false,
              className: 'text-red-500 hover:text-red-600',
            },
          ]
        : []),
    ]

    // Define marketing links for non-authenticated users
    const marketingLinks = [
      { href: ROUTES.MARKETING.HOME, label: 'Home' },
      { href: ROUTES.MARKETING.FEATURES, label: 'Features' },
      { href: ROUTES.MARKETING.DISCOVER, label: 'Discover' },
      { href: ROUTES.MARKETING.PRICING, label: 'Pricing' },
    ]

    // Return appropriate links based on authentication state
    return isAuthenticated
      ? authenticatedLinks.filter((link) => !link.requiresProfile || hasProfile)
      : marketingLinks
  }, [isAuthenticated, hasProfile, isAdmin])

  return (
    <div className='flex lg:items-center lg:justify-center lg:space-x-1'>
      {links.map(({ href, label, className }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'relative px-3 py-2 text-sm font-medium transition-colors',
              'hover:text-github-fg-default',
              'lg:rounded-md lg:px-4',
              'lg:hover:bg-github-canvas-subtle',
              isActive
                ? 'text-github-fg-default after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-github-accent-emphasis lg:after:hidden lg:bg-github-canvas-subtle'
                : 'text-github-fg-muted',
              'flex w-full items-center lg:w-auto',
              className
            )}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
