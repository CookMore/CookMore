'use client'

import { PanelContainer } from '@/components/panels/PanelContainer'

interface SingleSidebarLayoutProps {
  children: React.ReactNode
}

export function SingleSidebarLayout({ children }: SingleSidebarLayoutProps) {
  return (
    <div className='flex justify-center'>
      {/* Main Content - Centered on large screens */}
      <div className='flex-1 max-w-6xl px-2 sm:px-4 md:px-6'>{children}</div>

      {/* Right Panel Container - Controls the right panel position */}
      <div className='fixed right-0 top-[56px] bottom-0 w-full sm:w-[320px]'>
        <PanelContainer />
      </div>
    </div>
  )
}
