'use client'

import { cn } from '@/app/api/utils/utils'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn('max-w-screen-xl mx-auto px-4 py-6', className)}>{children}</div>
}