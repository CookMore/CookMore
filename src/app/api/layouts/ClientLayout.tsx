'use client'

import { Toaster } from 'sonner'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { ErrorBoundaryWrapper } from '@/app/api/error/ErrorBoundaryWrapper'
import { HeaderWrapper } from '@/app/api/header/HeaderWrapper'
import { FooterWrapper } from '@/app/api/footer/FooterWrapper'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <div className='flex min-h-screen flex-col'>
        <ErrorBoundaryWrapper name='root'>
          <HeaderWrapper />
          <div className='flex flex-1 relative'>
            <main className='flex-1 overflow-y-auto'>{children}</main>
          </div>
          <FooterWrapper />
        </ErrorBoundaryWrapper>
        <Toaster />
      </div>
    </TooltipProvider>
  )
}
