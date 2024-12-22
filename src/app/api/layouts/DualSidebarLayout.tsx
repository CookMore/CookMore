'use client'

import { cn } from '@/app/api/utils/utils'

interface DualSidebarLayoutProps {
  children: React.ReactNode
  leftSidebar?: React.ReactNode
  rightSidebar?: React.ReactNode
  className?: string
  mobileHeader?: React.ReactNode
}

export function DualSidebarLayout({
  children,
  leftSidebar,
  rightSidebar,
  className,
  mobileHeader,
}: DualSidebarLayoutProps) {
  return (
    <div className='flex-1 flex relative min-h-screen bg-github-canvas-default'>
      {/* Mobile Header */}
      {mobileHeader && (
        <div className='md:hidden fixed top-0 left-0 right-0 z-30 bg-github-canvas-default border-b border-github-border-default'>
          <div className='flex items-center h-12'>{mobileHeader}</div>
        </div>
      )}

      {/* Left sidebar area */}
      <div
        className={cn(
          'fixed left-0 bottom-0 z-40 bg-github-canvas-default border-r border-github-border-default',
          'transition-all duration-300 ease-in-out overflow-hidden',
          mobileHeader ? 'top-[48px]' : 'top-0',
          'md:z-20'
        )}
      >
        {/* Scrollable sidebar content */}
        <div className='h-full overflow-y-auto'>
          <div className='py-2'>{leftSidebar}</div>
        </div>
      </div>

      {/* Main content area */}
      <main
        className={cn(
          'flex-1 min-h-screen',
          mobileHeader ? 'mt-[48px] md:mt-0' : 'mt-0',
          'md:pl-[280px]'
        )}
      >
        <div className={cn('w-full h-full', className)}>{children}</div>
      </main>

      {/* Right sidebar area - Fixed on desktop */}
      {rightSidebar && (
        <div className='hidden lg:block fixed right-0 top-16 bottom-0 w-[256px] z-20 bg-github-canvas-default border-l border-github-border-default'>
          {rightSidebar}
        </div>
      )}
    </div>
  )
}
