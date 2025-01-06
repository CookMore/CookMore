'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { ROUTES } from '@/app/api/routes/routes'
import { NavigationLinks } from '@/app/api/navigation/NavigationLinks'
import { MobileMenu } from './MobileMenu'
import { AuthButton } from '@/app/api/auth/AuthButton'
import { AdminButton } from '@/app/[locale]/(authenticated)/admin/components/AdminButton'
import { IconMenu } from '@/app/api/icons'

interface HeaderProps {
  showAuthButton: boolean
}

export function Header({ showAuthButton }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, hasProfile } = useAuth()

  console.log('isAuthenticated:', isAuthenticated)

  return (
    <header className='sticky top-0 z-[99] w-full border-b border-github-border-default bg-github-canvas-default'>
      <div className='flex h-16 items-center justify-between'>
        <div className='flex items-center pl-4'>
          <Link
            href={
              isAuthenticated
                ? hasProfile
                  ? ROUTES.AUTH.DASHBOARD
                  : ROUTES.AUTH.PROFILE.CREATE
                : ROUTES.MARKETING.HOME
            }
            className='text-xl font-bold text-github-fg-default hover:text-github-fg-muted transition-colors'
          >
            CookMore
          </Link>
        </div>

        <div className='hidden lg:block flex-1 px-4'>
          <NavigationLinks />
        </div>

        <div className='flex items-center space-x-4 pr-4'>
          <button
            type='button'
            className='lg:hidden inline-flex items-center justify-center rounded-md p-2 text-github-fg-default hover:text-github-fg-muted hover:bg-github-canvas-subtle transition-colors'
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className='sr-only'>Open main menu</span>
            <IconMenu className='h-6 w-6' />
          </button>

          <div className='hidden sm:block'>
            <AdminButton />
          </div>

          <div>{showAuthButton && <AuthButton />}</div>
        </div>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
        <div className='block sm:hidden'>
          <AdminButton />
        </div>

        <div className='lg:hidden'>{showAuthButton && <AuthButton />}</div>
      </MobileMenu>
    </header>
  )
}
