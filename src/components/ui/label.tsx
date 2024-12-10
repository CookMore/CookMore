import { cn } from '@/lib/utils'
import { useTheme } from '@/app/providers/ThemeProvider'
import { forwardRef } from 'react'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  const { theme } = useTheme()

  return (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none',
        'text-github-fg-default',
        theme === 'neo' && 'neo-label',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  )
})

Label.displayName = 'Label'
