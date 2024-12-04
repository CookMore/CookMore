'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils/utils'

export function Tooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  className = '',
}: {
  children: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  className?: string
}) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          className={cn(
            'z-50 overflow-hidden rounded-md bg-github-canvas-overlay px-3 py-1.5 text-xs',
            'text-github-fg-default animate-in fade-in-0 zoom-in-95',
            'shadow-md',
            className
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className='fill-github-canvas-overlay' />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
