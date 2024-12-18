'use client'

import { ErrorBoundaryWrapper } from '@/app/api/error/ErrorBoundaryWrapper'
import { HeaderWrapper } from '@/app/api/header/HeaderWrapper'
import { FooterWrapper } from '@/app/api/footer/FooterWrapper'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundaryWrapper name='root'>
      <div className='flex flex-col'>
        <HeaderWrapper />
        <div className='flex flex-1 relative'>
          <main className='flex-1 overflow-y-auto'>{children}</main>
        </div>
        <FooterWrapper />
      </div>
    </ErrorBoundaryWrapper>
  )
}
