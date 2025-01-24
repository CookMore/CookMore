'use client'

import { Link } from '@/app/api/navigation/Link'
import { usePathname } from '@/i18n'
import { ROUTES } from '@/app/api/routes/routes'
import { cn } from '@/app/api/utils/utils'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { useMemo } from 'react'
import {
  IconChefHat,
  IconSearch,
  IconCalendar,
  IconTrophy,
  IconBell,
  IconBriefcase,
  IconPlus,
  IconGear,
  IconMembers,
} from '@/app/api/icons'

interface NavLink {
  href: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  requiresProfile?: boolean
  className?: string
}

export function NavigationLinks() {
  const pathname = usePathname()
  const { isAuthenticated, hasProfile, isAdmin } = useAuth()

  const links = useMemo(() => {
    const authenticatedLinks: NavLink[] = [
      {
        href: ROUTES.AUTH.KITCHEN,
        label: 'Kitchen',
        icon: IconChefHat,
        requiresProfile: true,
        className: 'flex items-center',
      },
      {
        href: ROUTES.AUTH.EXPLORE,
        label: 'Explore',
        icon: IconSearch,
        requiresProfile: true,
        className: 'flex items-center',
      },
      {
        href: ROUTES.AUTH.PLAN,
        label: 'Plan',
        icon: IconCalendar,
        requiresProfile: true,
        className: 'flex items-center',
      },
      {
        href: ROUTES.AUTH.NEWS,
        label: 'News',
        icon: IconBell,
        requiresProfile: true,
        className: 'flex items-center',
      },
      {
        href: ROUTES.AUTH.JOBS,
        label: 'Jobs',
        icon: IconBriefcase,
        requiresProfile: true,
        className: 'flex items-center',
      },
      {
        href: ROUTES.AUTH.MEMBERS,
        label: 'Members',
        icon: IconMembers,
        requiresProfile: true,
        className: 'flex items-center',
      },
      {
        href: ROUTES.AUTH.RECIPE.CREATE,
        label: 'Recipe',
        icon: IconPlus,
        requiresProfile: true,
        className: 'bg-green-500 text-white font-bold hover:bg-green-600',
      },
      {
        href: ROUTES.AUTH.NOTES,
        label: 'Sticky Note',
        icon: IconPlus,
        requiresProfile: true,
        className: 'flex items-center text-yellow-500',
      },
      ...(isAdmin
        ? [
            {
              href: ROUTES.AUTH.ADMIN,
              label: 'Admin',
              icon: IconGear,
              requiresProfile: false,
              className: 'text-red-500 hover:text-red-600',
            },
          ]
        : []),
    ]

    const marketingLinks: NavLink[] = [
      { href: ROUTES.MARKETING.HOME, label: 'Home', icon: IconChefHat },
      { href: ROUTES.MARKETING.FEATURES, label: 'Features', icon: IconTrophy },
      { href: ROUTES.MARKETING.DISCOVER, label: 'Discover', icon: IconSearch },
      { href: ROUTES.MARKETING.PRICING, label: 'Pricing', icon: IconTrophy },
    ]

    return isAuthenticated
      ? authenticatedLinks.filter((link) => !link.requiresProfile || hasProfile)
      : marketingLinks
  }, [isAuthenticated, hasProfile, isAdmin])

  return (
    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-center lg:space-x-2 space-y-2 lg:space-y-0'>
      {links.map(({ href, label, icon: Icon, className }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'relative px-3 py-2 text-sm font-semibold',
              'hover:text-github-fg-default',
              'lg:rounded-md lg:px-4',
              'flex w-full items-center justify-center lg:w-auto',
              'rounded-md',
              'bg-github-canvas-overlay',
              'transition-all duration-200',
              'shadow-sm hover:shadow-md',
              'border border-transparent',
              'hover:bg-github-btn-hover hover:border-gray-300',
              isActive
                ? 'bg-blue-500 text-white border-2 border-white font-bold'
                : 'text-github-fg-muted',
              className
            )}
          >
            <Icon className='w-4 h-4 mr-2 transition-transform duration-200 hover:scale-110' />
            <span className='text-center transition-transform duration-200 hover:scale-105'>
              {label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
