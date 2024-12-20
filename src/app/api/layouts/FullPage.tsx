'use client'

import { cn } from '@/app/api/utils/utils'

interface FullPageLayoutProps {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

export function FullPageLayout({ children, className, fullWidth }: FullPageLayoutProps) {
  return (
    <div className={`flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className={cn('w-full py-6', !fullWidth && 'max-w-3xl')}>{children}</div>
    </div>
  )
}
