'use client'

import { cn } from '@/app/api/utils/utils'

interface DualSidebarLayoutProps {
  children: React.ReactNode
  leftSidebar?: React.ReactNode
  rightSidebar?: React.ReactNode
  className?: string
  mobileHeader?: React.ReactNode
  isLeftSidebarExpanded?: boolean
}

export function DualSidebarLayout({
  children,
  leftSidebar,
  rightSidebar,
  className,
  mobileHeader,
  isLeftSidebarExpanded = true,
}: DualSidebarLayoutProps) {
  return (
    <div className='flex min-h-screen bg-github-canvas-default'>
      {/* Mobile Header */}
      {mobileHeader && (
        <div className='md:hidden fixed top-0 left-0 right-0 z-50 bg-github-canvas-default border-b border-github-border-default'>
          <div className='flex items-center h-12 px-4'>{mobileHeader}</div>
        </div>
      )}

      {/* Layout Container */}
      <div className='flex flex-1 relative'>
        {/* Left Sidebar Container - Only handles background */}

        {/* Left Sidebar Content */}
        {leftSidebar}

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 min-w-0 transition-all duration-300 ease-in-out relative z-10',
            isLeftSidebarExpanded ? 'pl-[280px]' : 'pl-[48px]',
            mobileHeader ? 'mt-12 md:mt-0' : '',
            rightSidebar ? 'lg:mr-[256px]' : '',
            className
          )}
        >
          <div className='w-full h-full'>{children}</div>
        </main>

        {/* Right Sidebar */}
        {rightSidebar && (
          <aside className='hidden lg:block fixed right-0 top-0 h-screen w-[256px] flex-shrink-0 bg-github-canvas-default border-l border-github-border-default z-20'>
            <div className='h-full overflow-y-auto'>{rightSidebar}</div>
          </aside>
        )}
      </div>
    </div>
  )
}
