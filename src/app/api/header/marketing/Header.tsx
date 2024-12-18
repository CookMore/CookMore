'use client'

import React from 'react'
import Link from 'next/link'
import { usePrivy } from '@privy-io/react-auth'
import { ROUTES } from '@/app/api/routes/routes'
import { NavigationLinks } from '@/app/api/navigation/NavigationLinks'
import { MarketingAuthButton } from './MarketingAuthButton'

function MarketingHeaderContent() {
  const { authenticated: isAuthenticated } = usePrivy()

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
  return <MarketingHeaderContent />
}
