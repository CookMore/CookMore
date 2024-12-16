'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { ROUTES } from '@/app/api/routes/routes'
import { cn } from '@/app/api/utils'
import { MarketingAuthButton } from './MarketingAuthButton'
import { NavigationLinks } from '@/app/api/navigation/NavigationLinks'

function MarketingHeaderContent() {
  const pathname = usePathname()
  const { authenticated: isAuthenticated } = usePrivy()

  // Only show on marketing routes or root
  const isMarketingRoute = pathname === '/' || pathname?.includes('(marketing)')
  if (!isMarketingRoute) return null

  return (
    <header className='sticky top-0 z-50 w-full border-b border-github-border-default bg-github-canvas-default'>
      <div className='container flex h-16 items-center'>
        <div className='mr-4'>
          <Link href='/' className='flex items-center space-x-2'>
            <span className='font-bold'>CookMore</span>
          </Link>
        </div>

        <nav className='flex flex-1'>
          <NavigationLinks authenticated={isAuthenticated} hasProfile={false} />
        </nav>

        <div className='flex items-center space-x-4'>
          <MarketingAuthButton />
        </div>
      </div>
    </header>
  )
}

export function Header() {
  return (
    <Suspense fallback={null}>
      <MarketingHeaderContent />
    </Suspense>
  )
}
