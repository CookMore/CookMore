'use client'

import Link from 'next/link'
import { ROUTES } from '@/lib/routes'
import { useAdminCheck } from '@/lib/auth/hooks/useAdminCheck'

interface NavigationLinksProps {
  authenticated: boolean
  hasProfile: boolean
}

export function NavigationLinks({ authenticated, hasProfile }: NavigationLinksProps) {
  const { isAdmin, isLoading } = useAdminCheck()

  return (
    <div className='flex items-center space-x-6'>
      {authenticated ? (
        <>
          {hasProfile && (
            <>
              <Link
                href={ROUTES.AUTH.KITCHEN.HOME}
                className='text-github-fg-muted hover:text-github-fg-default'
              >
                Kitchen
              </Link>
              <Link
                href={ROUTES.AUTH.CALENDAR}
                className='text-github-fg-muted hover:text-github-fg-default'
              >
                Calendar
              </Link>
              <Link
                href={ROUTES.AUTH.EXPLORE}
                className='text-github-fg-muted hover:text-github-fg-default'
              >
                Explore
              </Link>
              {!isLoading && isAdmin && (
                <Link href='/admin' className='text-red-500 hover:text-red-600'>
                  Admin
                </Link>
              )}
            </>
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
        </>
      )}
    </div>
  )
}
