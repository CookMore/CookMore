'use client'

import { cn } from '@/app/api/utils/utils'

interface FullPageLayoutProps {
  children: React.ReactNode
  className?: string
}

export function FullPageLayout({ children, className }: FullPageLayoutProps) {
  return (
    <div className={cn('flex flex-col items-center w-full px-4 sm:px-6 lg:px-8', className)}>
      <div className='w-full max-w-3xl py-6'>{children}</div>
    </div>
  )
}
