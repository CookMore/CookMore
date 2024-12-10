'use client'

import { Toaster } from 'sonner'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { ErrorBoundaryWrapper } from '@/components/ui/ErrorBoundaryWrapper'
import { HeaderWrapper } from '@/components/ui/HeaderWrapper'
import { FooterWrapper } from '@/components/ui/FooterWrapper'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <div className='flex min-h-screen flex-col'>
        <ErrorBoundaryWrapper name='root'>
          <HeaderWrapper />
          <main className='flex-1'>{children}</main>
          <FooterWrapper />
        </ErrorBoundaryWrapper>
        <Toaster />
      </div>
    </TooltipProvider>
  )
}
