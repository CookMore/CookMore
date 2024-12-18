'use client'

import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@radix-ui/react-tooltip'

export function RootTemplate({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      {children}
      <Toaster />
    </TooltipProvider>
  )
}
