'use client'

import { useState } from 'react'
import { IconMenu2, IconX } from '@tabler/icons-react'
import { cn } from '@/app/api/utils/utils'
import { NavigationLinks } from '@/app/api/navigation/NavigationLinks'

interface MobileMenuProps {
  authenticated: boolean
  hasProfile: boolean
  children?: React.ReactNode
}

export function MobileMenu({ authenticated, hasProfile, children }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='lg:hidden'>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='p-2 text-github-fg-default hover:bg-github-canvas-subtle rounded-md'
        aria-label='Toggle menu'
      >
        {isOpen ? <IconX className='h-6 w-6' /> : <IconMenu2 className='h-6 w-6' />}
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[60] bg-github-canvas-overlay/80 backdrop-blur-sm transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          'fixed inset-x-0 top-0 z-[60] w-full bg-github-canvas-default px-6 py-6',
          'transform transition-transform duration-300 ease-in-out lg:hidden',
          'border-b border-github-border-default shadow-lg',
          isOpen ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        {/* Close button */}
        <div className='flex items-center justify-end mb-8'>
          <button
            onClick={() => setIsOpen(false)}
            className='p-2 text-github-fg-default hover:bg-github-canvas-subtle rounded-md'
          >
            <IconX className='h-6 w-6' />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className='flex flex-col space-y-4'>
          <NavigationLinks authenticated={authenticated} hasProfile={hasProfile} />
        </nav>

        {/* Additional Menu Items (Auth Button, etc.) */}
        <div className='mt-8 flex flex-col space-y-4'>{children}</div>
      </div>
    </div>
  )
}
