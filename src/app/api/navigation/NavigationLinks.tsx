'use client'

import Link from 'next/link'
import { ROUTES } from '@/app/api/routes/routes'
import { useAdminCheck } from '@/app/api/auth/hooks/useAdminCheck'
import { Tooltip } from '@/app/api/tooltip/tooltip'

interface NavigationLinksProps {
  authenticated: boolean
  hasProfile: boolean
}

export function NavigationLinks({ authenticated, hasProfile }: NavigationLinksProps) {
  const { isAdmin, isLoading } = useAdminCheck()

  const AuthenticatedLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    if (!hasProfile && !isAdmin) {
      return (
        <Tooltip content='Complete your profile to access this feature'>
          <span className='cursor-not-allowed text-github-fg-muted opacity-50'>{children}</span>
        </Tooltip>
      )
    }

    return (
      <Link href={href} className='text-github-fg-muted hover:text-github-fg-default'>
        {children}
      </Link>
    )
  }

  return (
    <div className='flex items-center space-x-6'>
      {authenticated ? (
        <>
          <AuthenticatedLink href={ROUTES.AUTH.KITCHEN.HOME}>Kitchen</AuthenticatedLink>
          <AuthenticatedLink href={ROUTES.AUTH.KITCHEN.CLUB}>Club</AuthenticatedLink>
          <AuthenticatedLink href={ROUTES.AUTH.CALENDAR}>Calendar</AuthenticatedLink>
          <AuthenticatedLink href={ROUTES.AUTH.EXPLORE}>Explore</AuthenticatedLink>
          <AuthenticatedLink href={ROUTES.AUTH.TIER}>Tier</AuthenticatedLink>
          {!isLoading && isAdmin && (
            <Link href={ROUTES.AUTH.ADMIN} className='text-red-500 hover:text-red-600'>
              Admin
            </Link>
          )}
        </>
      ) : (
        <>
          <Link
            href={ROUTES.MARKETING.FEATURES}
            className='text-github-fg-muted hover:text-github-fg-default'
          >
            Features
          </Link>
          <Link
            href={ROUTES.MARKETING.DISCOVER}
            className='text-github-fg-muted hover:text-github-fg-default'
          >
            Discover
          </Link>
          <Link
            href={ROUTES.MARKETING.PRICING}
            className='text-github-fg-muted hover:text-github-fg-default'
          >
            Pricing
          </Link>
          <Link
            href={ROUTES.MARKETING.CLUB}
            className='text-github-fg-muted hover:text-github-fg-default'
          >
            Club
          </Link>
        </>
      )}
    </div>
  )
}
