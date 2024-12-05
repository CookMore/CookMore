'use client'

import { PageContainer } from '@/components/PageContainer'
import { KitchenLayoutClient } from './KitchenLayoutClient'

export default function KitchenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-github-canvas-default'>
      <PageContainer>
        <KitchenLayoutClient>{children}</KitchenLayoutClient>
      </PageContainer>
    </div>
  )
}
