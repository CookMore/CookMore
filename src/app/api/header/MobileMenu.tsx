'use client'

import { IconX } from '@tabler/icons-react'
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
        'fixed inset-0 z-[100] lg:hidden',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-github-canvas-overlay/80 backdrop-blur-sm transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          'fixed inset-x-0 top-0 z-[101] w-full bg-github-canvas-default px-6 py-6',
          'transform transition-transform duration-200 ease-in-out',
          'border-b border-github-border-default shadow-lg',
          isOpen ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        {/* Close button */}
        <div className='flex items-center justify-between mb-6'>
          <div className='text-xl font-bold text-github-fg-default'>Menu</div>
          <button
            onClick={onClose}
            className='p-2 text-github-fg-default hover:text-github-fg-muted hover:bg-github-canvas-subtle rounded-md transition-colors'
            aria-label='Close menu'
          >
            <IconX className='h-6 w-6' />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className='space-y-6'>
          <div className='border-b border-github-border-default pb-6'>
            <NavigationLinks />
          </div>
          {/* Additional Menu Items (Auth Button, etc.) */}
          <div className='space-y-4'>{children}</div>
        </div>
      </div>
    </div>
  )
}
