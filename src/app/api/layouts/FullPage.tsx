'use client'

import { cn } from '@/app/api/utils/utils'

interface FullPageLayoutProps {
  children: React.ReactNode
  className?: string
}

export function FullPageLayout({ children, className }: FullPageLayoutProps) {
  return (
    <div className={cn('flex justify-center', className)}>
      <div className='flex-1 max-w-7xl px-4 sm:px-6 lg:px-8'>{children}</div>
    </div>
  )
}
