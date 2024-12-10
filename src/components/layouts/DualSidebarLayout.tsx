'use client'

import { cn } from '@/lib/utils'

interface DualSidebarLayoutProps {
  children: React.ReactNode
  leftSidebar?: React.ReactNode
  className?: string
}

export function DualSidebarLayout({ children, leftSidebar, className }: DualSidebarLayoutProps) {
  return (
    <div className={cn('flex justify-center', className)}>
      {/* Left Sidebar - Mobile: Absolute, Desktop: Relative */}
      {leftSidebar}

      {/* Main Content */}
      <div className='flex-1 max-w-4xl'>
        <div className='w-full px-4 sm:px-6 md:px-8'>{children}</div>
      </div>
    </div>
  )
}
