'use client'

import { useState, useEffect } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils'

interface BasePageLayoutProps {
  children: React.ReactNode
  className?: string
}

export function BasePageLayout({ children, className }: BasePageLayoutProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <LoadingSpinner className='w-8 h-8' />
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8')}>{children}</div>
    </div>
  )
}
