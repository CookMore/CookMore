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
    <header className='sticky top-0 z-50 w-full border-b border-github-border-default bg-github-canvas-default backdrop-blur supports-[backdrop-filter]:bg-github-canvas-default/80'>
      <div className='w-full'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='h-16 flex items-center justify-between max-w-[1400px] mx-auto'>
            {/* Logo */}
            <div className='flex-shrink-0'>
              <Link
                href='/'
                className='text-xl font-bold text-github-fg-default hover:text-github-fg-muted transition-colors'
              >
                CookMore
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden lg:flex lg:flex-1 lg:justify-center lg:px-8'>
              <NavigationLinks authenticated={isAuthenticated} hasProfile={false} />
            </div>

            {/* Right Section */}
            <div className='flex items-center space-x-4'>
              <MarketingAuthButton />
            </div>
          </div>
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
