'use client'

import { cn } from '@/app/api/utils/utils'

interface SingleSidebarLayoutProps {
  children: React.ReactNode
  className?: string
}

export function SingleSidebarLayout({ children, className }: SingleSidebarLayoutProps) {
  return (
    <div className={cn('flex justify-center', className)}>
      {/* Main Content */}
      <div className='flex-1 max-w-6xl px-2 sm:px-4 md:px-6'>{children}</div>
    </div>
  )
}
