'use client'

import { InstallBanner } from '@/app/pwa/components/InstallBanner'
import { ClientLayout } from '@/components/layouts/ClientLayout'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InstallBanner />
      <div className='flex-1 bg-github-canvas-default'>
        <ClientLayout>{children}</ClientLayout>
      </div>
    </>
  )
}
