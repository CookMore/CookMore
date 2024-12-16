'use client'

import { cn } from '@/app/api/utils/utils'

interface DualSidebarLayoutProps {
  children: React.ReactNode
  leftSidebar?: React.ReactNode
  className?: string
}

export function DualSidebarLayout({ children, leftSidebar, className }: DualSidebarLayoutProps) {
  return (
    <div className={cn('flex justify-center gap-6', className)}>
      {/* Left Sidebar - Mobile: Absolute, Desktop: Sticky */}
      <div className='hidden lg:block w-72 flex-shrink-0'>{leftSidebar}</div>
      <div className='lg:hidden'>{leftSidebar}</div>

      {/* Main Content */}
      <div className='flex-1 max-w-4xl'>
        <div className='w-full'>{children}</div>
      </div>
    </div>
  )
}
