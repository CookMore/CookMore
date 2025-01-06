'use client'

import React from 'react'
import Link from 'next/link'
import { ROUTES } from '@/app/api/routes/routes'
import { NavigationLinks } from '@/app/api/navigation/NavigationLinks'
import { MarketingAuthButton } from './MarketingAuthButton'

interface MarketingHeaderProps {
  showAuthButton: boolean
}

export function MarketingHeader({ showAuthButton }: MarketingHeaderProps) {
  return (
    <header className='sticky top-0 z-[99] w-full border-b border-github-border-default bg-github-canvas-default'>
      <div className='flex h-16 items-center justify-between'>
        <div className='flex items-center pl-4'>
          <Link
            href={ROUTES.MARKETING.HOME}
            className='text-xl font-bold text-github-fg-default hover:text-github-fg-muted transition-colors'
          >
            CookMore
          </Link>
        </div>

        <div className='hidden lg:block flex-1 px-4'>
          <NavigationLinks />
        </div>

        <div className='flex items-center pr-4'>
          <div>{showAuthButton && <MarketingAuthButton />}</div>
        </div>
      </div>
    </header>
  )
}
