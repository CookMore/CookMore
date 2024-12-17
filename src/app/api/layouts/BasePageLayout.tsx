'use client'

import { useState, useEffect } from 'react'
import { LoadingSpinner } from '@/app/api/loading/LoadingSpinner'
import { cn } from '@/app/api/utils/utils'

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
    <div className={cn('min-h-screen bg-github-canvas-default', className)}>
      <div className='w-full mx-auto max-w-7xl'>{children}</div>
    </div>
  )
}
