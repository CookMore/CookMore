'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { useTheme } from '@/app/api/providers/ThemeProvider'
import { cn } from '@/app/api/utils/utils'

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  title?: string
}

// This is now only used for simple panels like notifications
// Main panel functionality is in PanelContainer
export function Panel({ title, children, className, ...props }: PanelProps) {
  const { theme } = useTheme()

  return (
    <div
      className={cn(
        'p-4 mb-4',
        // Base styles
        'bg-github-canvas-default border border-github-border-default rounded-lg',
        // Neo theme styles
        theme === 'neo' && [
          'neo-border',
          'relative',
          'hover:translate-y-[-2px]',
          'transition-all duration-300',
          'rotate-[-0.1deg] hover:rotate-0',
        ],
        // Copper theme styles
        theme === 'copper' && 'shine-effect copper-shine',
        // Steel theme styles
        theme === 'steel' && 'bg-steel-gradient',
        className
      )}
      {...props}
    >
      {title && (
        <h2
          className={cn(
            'text-lg font-semibold mb-4 text-github-fg-default',
            theme === 'neo' && 'font-mono tracking-tight'
          )}
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}
