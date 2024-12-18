'use client'

import { ErrorBoundaryWrapper } from '@/app/api/error/ErrorBoundaryWrapper'
import { HeaderWrapper } from '@/app/api/header/HeaderWrapper'
import { FooterWrapper } from '@/app/api/footer/FooterWrapper'
import { TooltipProvider } from '@radix-ui/react-tooltip'

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundaryWrapper name='root'>
      <TooltipProvider>
        <HeaderWrapper />
        <main className='flex-1'>{children}</main>
        <FooterWrapper />
      </TooltipProvider>
    </ErrorBoundaryWrapper>
  )
}
