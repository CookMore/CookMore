'use client'

import React from 'react'
import Link from 'next/link'
import { ROUTES } from '@/app/api/routes/routes'
import { NavigationLinks } from '@/app/api/navigation/NavigationLinks'
import { MarketingAuthButton } from './MarketingAuthButton'

export function MarketingHeader() {
  return (
    <header className='sticky top-0 z-40 w-full border-b border-github-border-default bg-github-canvas-default'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center'>
            <Link
              href={ROUTES.MARKETING.HOME}
              className='text-xl font-bold text-github-fg-default hover:text-github-fg-muted transition-colors'
            >
              CookMore
            </Link>
          </div>

          <div className='hidden lg:block'>
            <NavigationLinks />
          </div>

          <div className='flex items-center space-x-4'>
            <div className='hidden lg:block'>
              <MarketingAuthButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
