'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ROUTES } from '@/app/api/routes/routes'
import { cn } from '@/app/api/utils/utils'
import { useAdminCheck } from '@/app/api/auth/hooks/useAdminCheck'

interface NavigationLinksProps {
  authenticated: boolean
  hasProfile: boolean
}

export function NavigationLinks({ authenticated, hasProfile }: NavigationLinksProps) {
  const pathname = usePathname()
  const { isAdmin } = useAdminCheck()

  console.log('NavigationLinks Debug:', { authenticated, hasProfile, pathname, isAdmin })

  const links = authenticated
    ? [
        { href: ROUTES.AUTH.KITCHEN.HOME, label: 'Kitchen' },
        { href: ROUTES.AUTH.KITCHEN.CLUB, label: 'Club' },
        { href: ROUTES.AUTH.CALENDAR, label: 'Calendar' },
        { href: ROUTES.AUTH.EXPLORE, label: 'Explore' },
        { href: ROUTES.AUTH.TIER, label: 'Tier' },
        ...(isAdmin
          ? [
              {
                href: ROUTES.AUTH.ADMIN,
                label: 'Admin',
                className: 'text-red-500 hover:text-red-600',
              },
            ]
          : []),
      ]
    : [
        { href: ROUTES.MARKETING.FEATURES, label: 'Features' },
        { href: ROUTES.MARKETING.DISCOVER, label: 'Discover' },
        { href: ROUTES.MARKETING.PRICING, label: 'Pricing' },
        { href: ROUTES.MARKETING.CLUB, label: 'Club' },
      ]

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
