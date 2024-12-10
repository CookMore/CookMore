import { cn } from '@/lib/utils'
import { useTheme } from '@/app/providers/ThemeProvider'
import { forwardRef } from 'react'
import { Icons } from '@/components/icons'

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
          'transition-all relative',
          size === 'default' && 'px-4 py-2',
          size === 'sm' && 'px-3 py-1 text-sm',
          size === 'lg' && 'px-6 py-3 text-lg',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          theme === 'neo' && [
            'neo-border neo-shadow',
            'hover:translate-y-[-4px] hover:translate-x-[-4px]',
            'active:translate-y-[2px] active:translate-x-[2px]',
            variant === 'outline' && 'border-2 border-github-border-default',
            'bg-github-canvas-default hover:bg-github-canvas-subtle',
          ],
          theme !== 'neo' && [
            'rounded-md',
            'border border-github-border-default',
            variant === 'outline' && 'border-2',
            'hover:bg-github-canvas-subtle',
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
