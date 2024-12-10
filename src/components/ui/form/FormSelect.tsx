'use client'

import { cn } from '@/lib/utils'
import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  className?: string
}

export function Select({ label, error, className, ...props }: SelectProps) {
  return (
    <div className='w-full'>
      {label && (
        <label className='mb-2 block text-sm font-medium text-github-fg-default'>{label}</label>
      )}
      <select
        className={cn(
          'block w-full rounded-md border border-github-border-default bg-github-canvas-default px-3 py-2 text-sm text-github-fg-default shadow-sm',
          'focus:border-github-accent-emphasis focus:outline-none focus:ring-1 focus:ring-github-accent-emphasis',
          error && 'border-github-danger-emphasis',
          className
        )}
        {...props}
      />
      {error && <p className='mt-1 text-sm text-github-danger-fg'>{error}</p>}
    </div>
  )
}

// Also export as FormSelect for backwards compatibility
export { Select as FormSelect }
