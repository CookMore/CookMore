'use client'

import { IconMenu2, IconX } from '@tabler/icons-react'
import { cn } from '@/app/api/utils/utils'
import { NavigationLinks } from '@/app/api/navigation/NavigationLinks'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
}

export function MobileMenu({ isOpen, onClose, children }: MobileMenuProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 lg:hidden',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      {/* Hamburger Button */}
      <button
        onClick={onClose}
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
        onClick={onClose}
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
            onClick={onClose}
            className='p-2 text-github-fg-default hover:bg-github-canvas-subtle rounded-md'
          >
            <IconX className='h-6 w-6' />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className='mt-5 flow-root'>
          <div className='divide-y divide-github-border-default'>
            <div className='py-6'>
              <NavigationLinks />
            </div>
            {/* Additional Menu Items (Auth Button, etc.) */}
            <div className='mt-8 flex flex-col space-y-4'>{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
