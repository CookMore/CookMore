import { cn } from '@/lib/utils'
import { useTheme } from '@/app/providers/ThemeProvider'
import { forwardRef } from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    const { theme } = useTheme()

    return (
      <div className='w-full'>
        <textarea
          ref={ref}
          className={cn(
            'px-4 py-2 w-full transition-all min-h-[100px]',
            theme === 'neo' && [
              'neo-input',
              'focus:rotate-[0.5deg]',
              'placeholder:text-github-fg-subtle',
              error && 'border-github-danger-emphasis',
            ],
            theme !== 'neo' && [
              'rounded-md',
              'border border-github-border-default',
              'focus:border-github-accent-emphasis focus:outline-none',
              error && 'border-github-danger-emphasis',
            ],
            className
          )}
          {...props}
        />
        {error && <p className='mt-1 text-sm text-github-danger-fg'>{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
