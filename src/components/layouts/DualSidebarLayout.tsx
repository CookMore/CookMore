'use client'

import { PanelContainer } from '@/components/panels/PanelContainer'

interface DualSidebarLayoutProps {
  children: React.ReactNode
  leftSidebar?: React.ReactNode
}

export function DualSidebarLayout({ children, leftSidebar }: DualSidebarLayoutProps) {
  return (
    <div className='flex justify-center'>
      {/* Left Sidebar - Hidden on mobile */}
      <div className='hidden lg:block w-[240px] flex-shrink-0'>{leftSidebar}</div>

      {/* Main Content - Centered on large screens */}
      <div className='flex-1 max-w-4xl'>
        <div className='w-full px-4 sm:px-6 md:px-8'>{children}</div>
      </div>

      {/* Right Panel Container - Slides in on mobile */}
      <div className='fixed right-0 top-[56px] bottom-0 w-full sm:w-[320px]'>
        <PanelContainer />
      </div>
    </div>
  )
}
