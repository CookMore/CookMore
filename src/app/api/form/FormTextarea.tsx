'use client'

import { forwardRef } from 'react'
import { cn } from '@/app/api/utils/utils'

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  optional?: boolean
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, label, error, optional, ...props }, ref) => {
    return (
      <div className='space-y-2'>
        {label && (
          <div className='flex justify-between'>
            <label className='block text-sm font-medium text-github-fg-default'>
              {label}
              {optional && <span className='ml-1 text-github-fg-muted'>(Optional)</span>}
            </label>
          </div>
        )}
        <textarea
          className={cn(
            'min-h-[80px] w-full rounded-md border border-github-border-default bg-github-canvas-default px-3 py-2 text-sm text-github-fg-default placeholder:text-github-fg-subtle focus:border-github-accent-emphasis focus:outline-none focus:ring-1 focus:ring-github-accent-emphasis disabled:cursor-not-allowed disabled:opacity-50',
            error &&
              'border-github-danger-emphasis focus:border-github-danger-emphasis focus:ring-github-danger-emphasis',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className='text-sm text-github-danger-fg'>{error}</p>}
      </div>
    )
  }
)

FormTextarea.displayName = 'FormTextarea'
