import { cn } from '@/app/api/utils/utils'
import { useTheme } from '@/app/api/providers/core/ThemeProvider'
import { forwardRef } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, onChange, value, ...props }, ref) => {
    const { theme } = useTheme()

    return (
      <div className='w-full'>
        <input
          ref={ref}
          value={value}
          onChange={onChange}
          className={cn(
            'px-4 py-2 w-full transition-all',
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

Input.displayName = 'Input'
