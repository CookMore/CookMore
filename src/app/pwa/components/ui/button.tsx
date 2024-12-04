import React, { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'

    const variants = {
      default:
        'bg-github-accent-emphasis text-github-fg-onEmphasis hover:bg-github-accent-emphasis/90',
      secondary: 'bg-github-btn-bg text-github-fg-default hover:bg-github-btn-hover',
      destructive:
        'bg-github-danger-emphasis text-github-fg-onEmphasis hover:bg-github-danger-emphasis/90',
      outline: 'border border-github-border-default bg-transparent hover:bg-github-canvas-subtle',
    }

    const sizes = {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8',
      icon: 'h-9 w-9',
    }

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

    return <button className={classes} ref={ref} {...props} />
  }
)

Button.displayName = 'Button'
