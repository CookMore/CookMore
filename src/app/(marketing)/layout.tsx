'use client'

import { InstallBanner } from '@/app/pwa/components/InstallBanner'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-github-canvas-default'>
      <InstallBanner />
      <div className='flex flex-col min-h-[calc(100vh-var(--banner-height,0px))]'>{children}</div>
    </div>
  )
}
