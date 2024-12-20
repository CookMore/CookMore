import { cn } from '@/app/api/utils'
import { useTheme } from '@/app/api/providers/core/ThemeProvider'
import { forwardRef } from 'react'
import { Icons } from '@/app/api/icons/icons'

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
export type ButtonSize = 'default' | 'sm' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, children, ...props }, ref) => {
    const { theme } = useTheme()

    return (
      <button
        ref={ref}
        className={cn(
          'relative',
          // Size styles
          size === 'default' && 'px-4 py-2',
          size === 'sm' && 'px-3 py-1 text-sm',
          size === 'lg' && 'px-6 py-3 text-lg',
          // Base styles
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // Theme-specific styles
          theme === 'neo'
            ? [
                'neo-button',
                variant === 'outline' && 'border-2 border-github-border-default',
                'bg-white text-black',
              ]
            : [
                'rounded-md transition-all',
                'border border-github-border-default',
                variant === 'outline' && 'border-2',
                'bg-github-btn-bg text-github-fg-default',
                'hover:bg-github-btn-hover active:bg-github-btn-active',
              ],
          isLoading && 'cursor-wait',
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className='absolute inset-0 flex items-center justify-center'>
            <Icons.spinner className='w-4 h-4 animate-spin' />
          </span>
        ) : null}
        <span className={cn(isLoading && 'opacity-0')}>{children}</span>
      </button>
    )
  }
)

Button.displayName = 'Button'
