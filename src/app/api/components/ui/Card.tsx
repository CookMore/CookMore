import { cn } from '@/lib/utils'
import { useTheme } from '@/app/providers/ThemeProvider'
import { forwardRef } from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  const { theme } = useTheme()

  return (
    <div
      ref={ref}
      className={cn(
        'p-4',
        theme === 'neo' && [
          'neo-container',
          'hover:translate-y-[-2px] hover:translate-x-[-2px]',
          'transition-all',
        ],
        theme !== 'neo' && [
          'rounded-md',
          'border border-github-border-default',
          'bg-github-canvas-default',
        ],
        className
      )}
      {...props}
    />
  )
})

Card.displayName = 'Card'
