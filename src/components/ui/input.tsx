import { cn } from '@/lib/utils'
import { useTheme } from '@/app/providers/ThemeProvider'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const { theme } = useTheme()

  return (
    <input
      ref={ref}
      className={cn(
        'px-4 py-2 w-full transition-all',
        theme === 'neo' && [
          'neo-input',
          'focus:rotate-[0.5deg]',
          'placeholder:text-github-fg-subtle',
        ],
        theme !== 'neo' && [
          'rounded-md',
          'border border-github-border-default',
          'focus:border-github-accent-emphasis focus:outline-none',
        ],
        className
      )}
      {...props}
    />
  )
})

Input.displayName = 'Input'
