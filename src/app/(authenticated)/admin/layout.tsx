'use client'

import { BasePageLayout } from '@/components/layouts/BasePageLayout'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-github-canvas-default'>
      <BasePageLayout>{children}</BasePageLayout>
    </div>
  )
}
