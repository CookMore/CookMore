'use client'

import { BasePageLayout } from '@/app/api/layouts/BasePageLayout'
import { KitchenLayoutClient } from './KitchenLayoutClient'
import { KitchenProvider } from '@/app/api/providers/features/KitchenProvider'

export default function KitchenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-github-canvas-default'>
      <BasePageLayout>
        <KitchenProvider>
          <KitchenLayoutClient>{children}</KitchenLayoutClient>
        </KitchenProvider>
      </BasePageLayout>
    </div>
  )
}
