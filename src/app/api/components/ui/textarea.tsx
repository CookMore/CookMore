import { cn } from '@/app/api/utils/utils'
import { forwardRef } from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className='w-full'>
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md px-4 py-2',
            'transition-all duration-200 ease-in-out',
            'border border-github-border-default',
            'bg-github-canvas-default',
            'hover:border-2 hover:border-blue-500',
            'focus:border-github-accent-emphasis focus:outline-none focus:ring-1 focus:ring-github-accent-emphasis',
            'placeholder:text-github-fg-subtle',
            error && 'border-github-danger-emphasis',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className='mt-1 text-sm text-github-danger-fg'>{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
