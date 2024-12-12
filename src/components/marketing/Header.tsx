'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/hooks/useAuth'
import { ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Features', href: ROUTES.MARKETING.FEATURES },
  { label: 'Discover', href: ROUTES.MARKETING.DISCOVER },
  { label: 'Pricing', href: ROUTES.MARKETING.PRICING },
]

export function Header() {
  const pathname = usePathname()
  const { login, isAuthenticated } = useAuth()

  return (
    <header className='sticky top-0 z-50 w-full border-b border-github-border-default bg-github-canvas-default'>
      <div className='container flex h-16 items-center'>
        <div className='mr-4'>
          <Link href='/' className='flex items-center space-x-2'>
            <span className='font-bold'>CookMore</span>
          </Link>
        </div>

        <nav className='flex flex-1'>
          <ul className='flex items-center space-x-6'>
            {navItems.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'text-sm transition-colors hover:text-github-fg-default',
                    pathname === href ? 'text-github-fg-default' : 'text-github-fg-muted'
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className='flex items-center space-x-4'>
          {!isAuthenticated && (
            <Button variant='outline' onClick={login}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
