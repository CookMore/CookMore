import { cn } from '@/lib/utils'
import { useTheme } from '@/app/providers/ThemeProvider'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const { theme } = useTheme()

    return (
      <button
        ref={ref}
        className={cn(
          'px-4 py-2 transition-all',
          theme === 'neo' && [
            'neo-border neo-shadow',
            'hover:translate-y-[-4px] hover:translate-x-[-4px]',
            'active:translate-y-[2px] active:translate-x-[2px]',
            'bg-github-canvas-default hover:bg-github-canvas-subtle',
          ],
          theme !== 'neo' && [
            'rounded-md',
            'border border-github-border-default',
            'hover:bg-github-canvas-subtle',
          ],
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
