import React from 'react'
import { cn } from '../../lib/utils/utils' // Assuming you're using tailwind-merge

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

export function LoadingSpinner({
  size = 'md',
  className,
  label = 'Loading...',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div role='status' className='flex items-center justify-center'>
      <div
        className={cn(
          'animate-spin rounded-full border-github-border-default',
          'border-t-github-accent-fg',
          sizeClasses[size],
          className
        )}
      />
      <span className='sr-only'>{label}</span>
    </div>
  )
}
