'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className='w-full'>
      <div className={cn('mx-auto', 'max-w-[1400px]', 'px-4 sm:px-6 lg:px-8', className)}>
        {children}
      </div>
    </div>
  )
}
