'use client'

import { cn } from '@/app/api/utils/utils'

interface DualSidebarLayoutProps {
  children: React.ReactNode
  leftSidebar?: React.ReactNode
  isLeftSidebarExpanded: boolean
  rightSidebar?: React.ReactNode
  className?: string
}

export function DualSidebarLayout({
  children,
  leftSidebar,
  rightSidebar,
  className,
}: DualSidebarLayoutProps) {
  return (
    <div className='flex min-h-screen bg-github-canvas-default'>
      {/* Layout Container */}
      <div className='flex flex-1 relative'>
        {/* Left Sidebar Content */}
        {leftSidebar}

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 min-w-0 transition-all duration-300 ease-in-out relative z-10',
            'md:pl-[80px] pl-0',
            rightSidebar ? 'lg:mr-[256px]' : '',
            className
          )}
        >
          <div className='w-full h-full mx-auto max-w-[1440px] px-8'>{children}</div>
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
