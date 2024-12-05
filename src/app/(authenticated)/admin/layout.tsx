'use client'

import { PageContainer } from '@/components/PageContainer'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-github-canvas-default'>
      <PageContainer>{children}</PageContainer>
    </div>
  )
}
