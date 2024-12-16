'use client'

import { cn } from '@/app/api/utils/utils'

interface DualSidebarLayoutProps {
  children: React.ReactNode
  leftSidebar?: React.ReactNode
  rightSidebar?: React.ReactNode
}

export function DualSidebarLayout({ children, leftSidebar, rightSidebar }: DualSidebarLayoutProps) {
  return (
    <div className='flex-1 flex relative'>
      {/* Left sidebar area - Fixed position */}
      <div className='fixed left-0 top-16 bottom-0 z-20'>{leftSidebar}</div>

      {/* Main content area - With left margin for sidebar */}
      <div className='flex-1 min-w-0 ml-[280px]'>
        {/* Content container */}
        <div className='h-full w-full'>{children}</div>
      </div>

      {/* Right sidebar area - Fixed position */}
      {rightSidebar && (
        <div className='fixed right-0 top-16 bottom-0 w-64 z-20'>{rightSidebar}</div>
      )}
    </div>
  )
}
