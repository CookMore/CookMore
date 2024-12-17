'use client'

import { cn } from '@/app/api/utils/utils'

interface DualSidebarLayoutProps {
  children: React.ReactNode
  leftSidebar?: React.ReactNode
  rightSidebar?: React.ReactNode
}

export function DualSidebarLayout({ children, leftSidebar, rightSidebar }: DualSidebarLayoutProps) {
  return (
    <div className='flex-1 flex relative min-h-screen bg-github-canvas-default'>
      {/* Left sidebar area - Retracted on mobile, expanded on desktop */}
      <div className='fixed left-0 top-16 bottom-0 z-20 w-12 md:w-[280px] transition-all duration-300 ease-in-out'>
        {leftSidebar}
      </div>

      {/* Main content area - Full width on mobile, with margins on desktop */}
      <div className='flex-1 min-w-0 ml-12 md:ml-[280px] transition-all duration-300 ease-in-out'>
        {/* Content container with max width and centered */}
        <div className='h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>{children}</div>
      </div>

      {/* Right sidebar area - Hidden on mobile, fixed on desktop */}
      {rightSidebar && (
        <div className='hidden lg:block fixed right-0 top-16 bottom-0 w-[256px] z-20 bg-github-canvas-default border-l border-github-border-default'>
          {rightSidebar}
        </div>
      )}
    </div>
  )
}
