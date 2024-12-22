'use client'

import { useHydration } from '@/app/api/hooks/useHydration'
import { LoadingSpinner } from '@/app/api/loading/LoadingSpinner'
import { cn } from '@/app/api/utils/utils'

interface HydrationLoaderProps {
  children: React.ReactNode
  className?: string
}

export function HydrationLoader({ children, className }: HydrationLoaderProps) {
  const mounted = useHydration()

  if (!mounted) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <LoadingSpinner className='w-8 h-8' />
      </div>
    )
  }

  return (
    <div className={cn('min-h-screen bg-github-canvas-default', className)}>
      <div className='w-full'>{children}</div>
    </div>
  )
}
